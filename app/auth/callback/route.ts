// app/auth/callback/route.ts
// Callback für Magic Link / Signup-Confirm -> tauscht Code gegen Session.

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const preferredRegion: string[] = ['fra1']
export const runtime = 'nodejs' // stabil mit @supabase/ssr

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/app'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
