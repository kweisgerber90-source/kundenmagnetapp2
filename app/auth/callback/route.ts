// app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Auth Callback Handler
 * Wird nach E-Mail-Bestätigung oder Magic Link aufgerufen
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/app'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Erfolgreicher Login - zum Dashboard weiterleiten
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Auth-Fehler - zurück zum Login
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
