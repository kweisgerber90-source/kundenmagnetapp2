// app/auth/signout/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Signout Handler
 * Meldet den Benutzer ab und leitet zur Homepage weiter
 */
export async function POST(request: Request) {
  const supabase = await createClient()
  await supabase.auth.signOut()

  return NextResponse.redirect(new URL('/', request.url))
}
