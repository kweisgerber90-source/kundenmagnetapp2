// app/api/audit-log/route.ts
// API-Endpoint zum Abrufen der Audit-Logs des aktuell angemeldeten Nutzers.
// RLS stellt sicher, dass nur eigene Einträge (actor = auth.uid()) gelesen werden.
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

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

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // 🔒 Nutzer prüfen (nur eingeloggte Nutzer haben Zugriff)
    const { data: userData, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userData?.user) {
      // 🔧 Korrektur: Klare 401 bei fehlender Auth
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }

    const url = new URL(request.url)
    const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10))
    const limit = Math.min(200, Math.max(1, parseInt(url.searchParams.get('limit') ?? '50', 10)))
    const action = url.searchParams.get('action') || undefined
    const target = url.searchParams.get('target') || undefined
    const dateFrom = url.searchParams.get('date_from') || undefined
    const dateTo = url.searchParams.get('date_to') || undefined

    const from = (page - 1) * limit
    const to = from + limit - 1

    // Basis-Query mit Zählung
    let query = supabase
      .from('audit_log')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    // Filter anwenden (optional)
    if (action) query = query.eq('action', action)
    if (target) query = query.eq('target', target)
    if (dateFrom) query = query.gte('created_at', dateFrom)
    if (dateTo) query = query.lte('created_at', dateTo)

    const { data, error, count } = await query

    if (error) {
      // 🔧 Korrektur: Fehler sauber loggen
      console.error('[audit-log] Supabase-Fehler:', error)
      return NextResponse.json({ error: 'Datenbankfehler' }, { status: 500 })
    }

    // Profil-Daten des Actors (aktueller Nutzer) für Anzeige anreichern
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, name')
      .eq('id', userData.user.id)
      .maybeSingle()

    const enriched = (data ?? []).map((row: AuditLogRow) => ({
      ...row,
      actor_profile: profile ?? null,
    }))

    return NextResponse.json({
      data: enriched,
      pagination: {
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limit),
      },
    })
  } catch (err) {
    console.error('[audit-log] Unerwarteter Fehler:', err)
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}
