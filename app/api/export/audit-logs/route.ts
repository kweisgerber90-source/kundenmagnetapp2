// /app/api/export/audit-logs/route.ts
/**
 * API Route: CSV-Export für Audit Logs
 * GET /api/export/audit-logs
 *
 * Query-Parameter:
 * - action (optional)
 * - target (optional)
 * - date_from | dateFrom (optional)  // ISO
 * - date_to   | dateTo   (optional)  // ISO
 * - format (optional): 'iso' | 'de' (andere Werte werden auf 'de' gemappt)
 */

import { createCSVResponse, createTimestampedFilename, exportAuditLogsToCSV } from '@/lib/csv'
import type { AuditLogCSVRow } from '@/lib/csv/types'
import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const preferredRegion = ['fra1']

type AuditLogRow = {
  id: number
  actor: string | null
  action: string
  target: string
  meta: Record<string, unknown> | null
  created_at: string
}

type Profile = { id: string; email: string; name: string | null }

// 🔧 Korrektur: Nur die erlaubten Formate der CSV-Utils
type DateFormat = 'iso' | 'de'

// 🔧 Korrektur: Normalisiert beliebige Eingaben auf einen gültigen Wert
function normalizeDateFormat(input: string | null): DateFormat {
  const v = (input ?? '').toLowerCase()
  if (v === 'iso') return 'iso'
  // alles andere → 'de' (Standard)
  return 'de'
}

export async function GET(request: NextRequest) {
  try {
    // 🔒 Authentifizierung
    const supabase = createClient() // Fabrik ist synchron
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Nicht authentifiziert' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Query-Parameter
    const sp = request.nextUrl.searchParams
    const action = sp.get('action') || undefined
    const target = sp.get('target') || undefined

    // beide Schreibweisen akzeptieren
    const dateFrom = sp.get('date_from') || sp.get('dateFrom') || undefined
    const dateTo = sp.get('date_to') || sp.get('dateTo') || undefined

    // 🔧 Korrektur: auf gültigen Typ mappen, чтобы TS2322 исчез
    const dateFormat: DateFormat = normalizeDateFormat(sp.get('format'))

    // Kein implicit join auf users!inner(email)
    const MAX_EXPORT = 10000
    let query = supabase
      .from('audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(MAX_EXPORT)
    // RLS lässt nur eigene Einträge zu (actor = auth.uid())

    if (action) query = query.eq('action', action)
    if (target) query = query.eq('target', target)
    if (dateFrom) query = query.gte('created_at', dateFrom)
    if (dateTo) query = query.lte('created_at', dateTo)

    const { data: logs, error: fetchError } = await query

    if (fetchError) {
      console.error('Audit logs fetch error:', fetchError)
      return new Response(JSON.stringify({ error: 'Fehler beim Laden der Daten' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!logs || logs.length === 0) {
      // Пустой CSV с заголовком вместо 404
      const filename = createTimestampedFilename('audit_logs_export')
      const emptyCsv = exportAuditLogsToCSV([], { filename, dateFormat })
      return createCSVResponse(emptyCsv, filename)
    }

    // Profile separat laden (kein FK nötig)
    const actorIds = Array.from(
      new Set((logs as AuditLogRow[]).map((l) => l.actor).filter(Boolean) as string[]),
    )

    let profilesMap: Record<string, Profile> = {}
    if (actorIds.length > 0) {
      const { data: profiles, error: pErr } = await supabase
        .from('profiles')
        .select('id,email,name')
        .in('id', actorIds)

      if (pErr) {
        console.error('Profiles fetch error:', pErr)
      } else if (profiles) {
        profilesMap = profiles.reduce<Record<string, Profile>>((acc, p) => {
          acc[p.id] = p
          return acc
        }, {})
      }
    }

    // Mapping auf CSV-Row-Struktur eurer Utils
    const csvRows: AuditLogCSVRow[] = (logs as AuditLogRow[]).map((log) => {
      const prof = log.actor ? profilesMap[log.actor] : undefined
      return {
        id: String(log.id), // falls CSV-Typ строковый
        user_id: log.actor ?? '',
        user_email: prof?.email ?? '',
        action: log.action,
        entity_type: '', // nicht vorhanden in eurer Tabelle
        entity_id: log.target ?? '',
        old_values: '', // не разделяем старые/новые
        new_values: JSON.stringify(log.meta ?? {}),
        ip_hash: '', // nicht vorhanden in eurer Tabelle
        created_at: log.created_at,
      }
    })

    // CSV generieren über eure Utils
    const filename = createTimestampedFilename('audit_logs_export')
    const csv = exportAuditLogsToCSV(csvRows, { filename, dateFormat })
    return createCSVResponse(csv, filename)
  } catch (error) {
    console.error('Export error:', error)
    return new Response(JSON.stringify({ error: 'Interner Serverfehler' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
