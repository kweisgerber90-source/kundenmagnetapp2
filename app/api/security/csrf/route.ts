// app/api/security/csrf/route.ts
import { generateCSRFToken } from '@/lib/security'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const preferredRegion = 'fra1'

/**
 * Generate CSRF token for forms
 */
export async function GET() {
  const token = generateCSRFToken()

  const response = NextResponse.json({ token })

  // Set token in httpOnly cookie
  response.cookies.set('csrf-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600, // 1 hour
  })

  return response
}
