// next.config.js  (CommonJS, Kommentare auf Deutsch)
/** @type {import('next').NextConfig} */

// 🔒 Kein Trailing Slash – wichtig für Webhooks (Stripe folgt keinen Redirects)
const nextConfig = {
  trailingSlash: false, // ⬅️ erzwingt URLs ohne Slash am Ende
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    unoptimized: true,
  },

  experimental: {
    typedRoutes: true,
  },

  // 👉 Kanonische Redirects NUR für Nicht-API-Pfade
  async redirects() {
    return buildCanonicalRedirects()
  },

  // Sicherheits-Header + CSP
  async headers() {
    const widgetParents = process.env.WIDGET_ALLOWED_PARENTS
      ? process.env.WIDGET_ALLOWED_PARENTS.split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : ['*'] // TODO (Prod): Konkrete Origins statt * eintragen

    const globalCsp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://cdn.jsdelivr.net https://vercel.live",
      "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://cdn.jsdelivr.net https://vercel.live",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      `connect-src 'self' ${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''} https://*.supabase.co wss://*.supabase.co https://vitals.vercel-insights.com https://vercel.live wss://vercel.live wss://*.vercel.live`,
      "worker-src 'self' blob:",
      "frame-src 'self' https://js.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      'upgrade-insecure-requests',
    ].join('; ')

    const widgetFrameCsp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      'sandbox allow-scripts allow-same-origin',
      `frame-ancestors ${widgetParents.join(' ')}`,
    ].join('; ')

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          { key: 'Content-Security-Policy', value: globalCsp },
        ],
      },
      {
        source: '/widget/frame/:path*',
        headers: [{ key: 'Content-Security-Policy', value: widgetFrameCsp }],
      },
      {
        source: '/widget.js',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/api/widget/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ]
  },
}

module.exports = nextConfig

// ───────────────────────────────────────────────────────────────────────────────
// Hilfsfunktion: liefert WWW↔Apex-Redirects, aber NICHT für /api/*
// Regex-Quelle: '/((?!api/).*)' schließt alle Pfade aus, die mit 'api/' beginnen
function buildCanonicalRedirects() {
  const base = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_URL
  if (!base) return []

  try {
    const { hostname } = new URL(base)
    const isWWW = hostname.startsWith('www.')
    const apex = isWWW ? hostname.replace(/^www\./, '') : hostname
    const www = isWWW ? hostname : `www.${hostname}`

    // Nur Nicht-API-Pfade: negative Lookahead (kein /api/ am Anfang)
    const nonApiSource = '/((?!api/).*)'

    if (isWWW) {
      // Apex → WWW
      return [
        {
          source: nonApiSource,
          has: [{ type: 'host', value: apex }],
          destination: `https://${www}/:path*`,
          permanent: true,
        },
      ]
    }
    // WWW → Apex
    return [
      {
        source: nonApiSource,
        has: [{ type: 'host', value: www }],
        destination: `https://${apex}/:path*`,
        permanent: true,
      },
    ]
  } catch {
    return []
  }
}
