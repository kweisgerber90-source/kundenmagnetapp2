// app/auth/confirm/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Email Confirmation Handler
 * Alternative zu /auth/callback für ältere E-Mail-Links
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/app'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'email' | 'signup' | 'magiclink' | 'recovery' | 'invite',
    })

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Fehler - zurück zum Login
  return NextResponse.redirect(`${origin}/login?error=confirmation_failed`)
}
