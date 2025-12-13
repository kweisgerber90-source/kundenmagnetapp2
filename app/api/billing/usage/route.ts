// /app/api/billing/usage/route.ts
/**
 * 📊 API: Usage Stats
 * GET /api/billing/usage - Liefert aktuelle Nutzungsstatistiken
 */

import { getUserUsageStats } from '@/lib/billing/usage'
import { createClient } from '@/lib/supabase/server'
import type { UsageStats } from '@/lib/types/billing'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const preferredRegion = ['fra1']

export async function GET(_request: NextRequest) {
  try {
    // 1. Authentifizierung
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    // 2. Usage Stats holen
    const stats: UsageStats = await getUserUsageStats(user.id)

    return NextResponse.json(stats)
  } catch (error) {
    console.error('[Usage API] Error:', error)
    return NextResponse.json({ error: 'Server Fehler' }, { status: 500 })
  }
}
