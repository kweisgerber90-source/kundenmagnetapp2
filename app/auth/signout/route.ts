// app/auth/signout/route.ts
// POST: meldet ab und leitet zur Startseite.

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const preferredRegion: string[] = ['fra1']
export const runtime = 'nodejs'

export async function POST(request: Request) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/', request.url))
}
