// app/auth/callback/route.ts
// Универсальный обработчик: PKCE code ИЛИ token_hash/type (классическая верификация)

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const preferredRegion: string[] = ['fra1']
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const origin = url.origin
  const next = url.searchParams.get('next') ?? '/app'

  const code = url.searchParams.get('code')
  const token_hash = url.searchParams.get('token_hash')
  const type = url.searchParams.get('type') as
    | 'signup'
    | 'email'
    | 'magiclink'
    | 'recovery'
    | 'invite'
    | null

  const supabase = createClient()

  try {
    // 1) Классическая верификация через token_hash/type
    if (token_hash && type) {
      const { error } = await supabase.auth.verifyOtp({ token_hash, type })
      if (!error) return NextResponse.redirect(`${origin}${next}`)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
    }

    // 2) PKCE-код для magic-link / oauth
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) return NextResponse.redirect(`${origin}${next}`)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
    }

    // 3) Нет подходящих параметров
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(msg)}`)
  }
}
