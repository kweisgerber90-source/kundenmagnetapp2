// app/auth/confirm/route.ts
// Bestätigt E-Mail (signup/recovery/etc.) ODER tauscht PKCE-Code gegen Session.
// Danach sauberer Redirect auf /app (oder ?error=...)

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const preferredRegion: string[] = ['fra1']
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const origin = url.origin
  const next = url.searchParams.get('next') ?? '/app'

  const token_hash = url.searchParams.get('token_hash')
  const type = url.searchParams.get('type') as
    | 'signup'
    | 'email'
    | 'magiclink'
    | 'recovery'
    | 'invite'
    | null

  const code = url.searchParams.get('code')

  const supabase = createClient()

  // 1) Vorrang: klassische Bestätigungslinks mit token_hash + type
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type })
    if (!error) return NextResponse.redirect(`${origin}${next}`)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
  }

  // 2) Fallback: falls ein PKCE-Code doch hier landet (manche Mail-Clients/Apps)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}${next}`)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
  }

  // 3) Nichts Passendes -> Fehler
  return NextResponse.redirect(`${origin}/login?error=confirmation_failed`)
}
