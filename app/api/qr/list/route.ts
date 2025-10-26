// app/api/qr/list/route.ts
// 📡 API: Liste aller QR-Codes des Nutzers
// 🔐 DSGVO: Nur eigene QR-Codes sichtbar

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const preferredRegion = ['fra1']
export const runtime = 'nodejs'

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('qr_codes')
      .select(
        `
        *,
        campaigns:campaign_id (
          name,
          slug
        )
      `,
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[qr-list] DB-Fehler:', error)
      return NextResponse.json({ error: 'Fehler beim Laden der QR-Codes' }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (err) {
    console.error('[qr-list] Unerwarteter Fehler:', err)
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}
