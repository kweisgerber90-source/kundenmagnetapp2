// app/api/export/audit-logs/route.ts
/**
 * API Route: CSV-Export für Audit Logs
 * GET /api/export/audit-logs?action=create&entity_type=campaign
 *
 * Query-Parameter:
 * - action (optional): Filter nach Aktion (create, update, delete, etc.)
 * - entity_type (optional): Filter nach Entitätstyp (campaign, testimonial, etc.)
 * - date_from (optional): Von-Datum (ISO)
 * - date_to (optional): Bis-Datum (ISO)
 * - format (optional): Datumsformat (iso, de) - Standard: de
 */

import { createCSVResponse, createTimestampedFilename, exportAuditLogsToCSV } from '@/lib/csv'
import type { AuditLogCSVRow } from '@/lib/csv/types'
import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const preferredRegion = ['fra1']

export async function GET(request: NextRequest) {
  try {
    // Authentifizierung prüfen
    const supabase = await createClient()
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

    // Query-Parameter extrahieren
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action')
    const entityType = searchParams.get('entity_type')
    const dateFrom = searchParams.get('date_from')
    const dateTo = searchParams.get('date_to')
    const dateFormat = (searchParams.get('format') || 'de') as 'iso' | 'de'

    // Query aufbauen
    let query = supabase
      .from('audit_log')
      .select(
        `
        id,
        user_id,
        users!inner(email),
        action,
        entity_type,
        entity_id,
        old_values,
        new_values,
        ip_hash,
        created_at
      `,
      )
      .eq('user_id', user.id)

    // Filter anwenden
    if (action) {
      query = query.eq('action', action)
    }
    if (entityType) {
      query = query.eq('entity_type', entityType)
    }
    if (dateFrom) {
      query = query.gte('created_at', dateFrom)
    }
    if (dateTo) {
      query = query.lte('created_at', dateTo)
    }

    // Sortierung
    query = query.order('created_at', { ascending: false })

    // Limit für Performance (max. 10.000 Einträge)
    query = query.limit(10000)

    // Daten abrufen
    const { data: logs, error: fetchError } = await query

    if (fetchError) {
      console.error('Audit logs fetch error:', fetchError)
      return new Response(JSON.stringify({ error: 'Fehler beim Laden der Daten' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!logs || logs.length === 0) {
      return new Response(JSON.stringify({ error: 'Keine Daten gefunden' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Daten für CSV transformieren
    const csvRows: AuditLogCSVRow[] = logs.map((log) => {
      // Type-safe: users kann Array oder Objekt sein
      const usersData = log.users as unknown
      let userEmail = ''

      if (Array.isArray(usersData) && usersData.length > 0) {
        userEmail = usersData[0]?.email || ''
      } else if (usersData && typeof usersData === 'object' && 'email' in usersData) {
        userEmail = (usersData as { email: string }).email || ''
      }

      return {
        id: log.id,
        user_id: log.user_id,
        user_email: userEmail,
        action: log.action,
        entity_type: log.entity_type,
        entity_id: log.entity_id || '',
        old_values: JSON.stringify(log.old_values || {}),
        new_values: JSON.stringify(log.new_values || {}),
        ip_hash: log.ip_hash || '',
        created_at: log.created_at,
      }
    })

    // CSV generieren
    const filename = createTimestampedFilename('audit_logs_export')
    const csv = exportAuditLogsToCSV(csvRows, {
      filename,
      dateFormat,
    })

    // CSV-Response zurückgeben
    return createCSVResponse(csv, filename)
  } catch (error) {
    console.error('Export error:', error)
    return new Response(JSON.stringify({ error: 'Interner Serverfehler' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
