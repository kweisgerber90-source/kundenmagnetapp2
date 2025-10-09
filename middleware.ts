import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const pathname = request.nextUrl.pathname

  // Rate limiting headers (basic implementation)
  response.headers.set('X-RateLimit-Limit', '100')
  response.headers.set('X-RateLimit-Remaining', '99')
  response.headers.set('X-RateLimit-Reset', new Date(Date.now() + 60000).toISOString())

  // Security headers (additional to next.config.ts)
  response.headers.set('X-Request-ID', crypto.randomUUID())

  // CORS for API routes
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin')

    // Widget API - allow all origins
    if (pathname.startsWith('/api/widget')) {
      response.headers.set('Access-Control-Allow-Origin', origin || '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      response.headers.set('Access-Control-Max-Age', '86400')

      // Handle preflight
      if (request.method === 'OPTIONS') {
        return new NextResponse(null, { status: 200, headers: response.headers })
      }
    }
    // Other APIs - restrict to same origin
    else {
      const allowedOrigins = ['https://kundenmagnet-app.de', 'http://localhost:3000']

      if (origin && allowedOrigins.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin)
        response.headers.set('Access-Control-Allow-Credentials', 'true')
      }
    }
  }

  // CSRF protection for mutations
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const origin = request.headers.get('origin')
    const host = request.headers.get('host')

    // Skip CSRF for widget API (public) and consent logging
    if (!pathname.startsWith('/api/widget') && !pathname.startsWith('/api/consent')) {
      // Verify origin matches host
      if (origin && !origin.includes(host || '')) {
        return new NextResponse('CSRF validation failed', { status: 403 })
      }
    }
  }

  // Prevent access to sensitive files
  const sensitivePatterns = [/\.env/, /\.git/, /\.vscode/, /node_modules/, /\.next/]

  if (sensitivePatterns.some((pattern) => pattern.test(pathname))) {
    return new NextResponse('Not Found', { status: 404 })
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
