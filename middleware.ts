// middleware.ts
// Setzt Basis-Header + ruft updateSession für Supabase auf.

import { updateSession } from '@/lib/supabase/middleware'
import { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)

  // Sicherheits- und Diagnose-Header
  response.headers.set('X-Request-ID', crypto.randomUUID())
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  matcher: [
    // Alles außer typischen statischen Routen/Dateien
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
