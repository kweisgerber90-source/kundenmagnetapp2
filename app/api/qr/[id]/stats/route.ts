// /app/api/qr/[id]/stats/route.ts
// 📊 Statistik-Endpoint für einen QR-Code (letzte 30 Tage)
// 🔐 Zugriff nur für Besitzer dank RLS + Ownership-Check

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const preferredRegion = ['fra1']

type ScanRow = { created_at: string }

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: qrId } = await params
    const supabase = await createClient()

    // 1) Auth prüfen
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    // 2) Ownership prüfen
    const { data: own } = await supabase
      .from('qr_codes')
      .select('id')
      .eq('id', qrId)
      .eq('user_id', user.id)
      .single()

    if (!own) {
      return NextResponse.json({ error: 'QR-Code nicht gefunden' }, { status: 404 })
    }

    // 3) Scans der letzten 30 Tage laden
    const since = new Date()
    since.setDate(since.getDate() - 30)

    const { data: scans, error } = await supabase
      .from('qr_scans')
      .select('created_at')
      .eq('qr_id', qrId)
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: true })

    if (error) {
      console.error('[qr-stats] DB-Fehler:', error)
      return NextResponse.json({ error: 'Fehler beim Laden der Scans' }, { status: 500 })
    }

    const list = (scans ?? []) as ScanRow[]
    const now = new Date()

    // Summen
    const total = list.length
    const last7 = list.filter(
      (s) => new Date(s.created_at) >= new Date(now.getTime() - 7 * 86400 * 1000),
    ).length
    const last30 = list.length // bereits gefiltert

    // Gruppierung pro Tag (YYYY-MM-DD)
    const byDayMap = new Map<string, number>()
    list.forEach((s) => {
      const key = new Date(s.created_at).toISOString().slice(0, 10)
      byDayMap.set(key, (byDayMap.get(key) ?? 0) + 1)
    })

    // Fehlende Tage mit 0 auffüllen (letzte 30 Tage)
    const series: { date: string; count: number }[] = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      series.push({ date: key, count: byDayMap.get(key) ?? 0 })
    }

    return NextResponse.json(
      {
        total,
        last7Days: last7,
        last30Days: last30,
        byDay: series,
      },
      { status: 200 },
    )
  } catch (err) {
    console.error('[qr-stats] Unerwarteter Fehler:', err)
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}
