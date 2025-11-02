// next.config.js  (CommonJS, Kommentare auf Deutsch)
/** @type {import('next').NextConfig} */

// Hilfsfunktion: leitet anhand APP_BASE_URL WWW ↔ Apex um
function buildCanonicalRedirects() {
  const base = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_URL
  if (!base) return []

  try {
    const { hostname } = new URL(base) // z. B. "www.kundenmagnet-app.de" oder "kundenmagnet-app.de"
    const isWWW = hostname.startsWith('www.')
    const apex = isWWW ? hostname.replace(/^www\./, '') : hostname
    const www = isWWW ? hostname : `www.${hostname}`

    // Wenn kanonisch WWW → leite Apex → WWW um
    if (isWWW) {
      return [
        {
          source: '/:path*',
          has: [{ type: 'host', value: apex }],
          destination: `https://${www}/:path*`,
          permanent: true,
        },
      ]
    }
    // Wenn kanonisch Apex → leite WWW → Apex um
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: www }],
        destination: `https://${apex}/:path*`,
        permanent: true,
      },
    ]
  } catch {
    return []
  }
}

const nextConfig = {
  // Aktiviert Strict Mode für React
  reactStrictMode: true,

  // Entfernt den "X-Powered-By"-Header
  poweredByHeader: false,

  // Bildkonfiguration
  // WICHTIG: Für lokale API-Routen (/api/qr/...) sind keine Fremd-Domains nötig.
  // Wenn du später direkt aus externen Quellen (z. B. Supabase Storage) lädst,
  // füge remotePatterns hinzu.
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    // remotePatterns: [
    //   { protocol: 'https', hostname: '**.supabase.co' },
    //   { protocol: 'https', hostname: 'www.kundenmagnet-app.de' },
    //   { protocol: 'https', hostname: 'kundenmagnet-app.de' },
    // ],
  },

  // Optionale Next-Experimente
  experimental: {
    typedRoutes: true,
  },

  // Redirects für kanonischen Host (aus APP_BASE_URL abgeleitet)
  async redirects() {
    return buildCanonicalRedirects()
  },

  // HTTP-Sicherheitsheader & CSP
  async headers() {
    // HINWEIS:
    // - Global blocken wir Einbettungen via CSP: frame-ancestors 'none'
    // - Für /widget/frame erlauben wir Einbettung gezielt und setzen sandbox
    // - X-Frame-Options wird absichtlich NICHT global gesetzt (Konfliktvermeidung)

    // Erlaubte Eltern-Domains für den Widget-iFrame (per ENV steuerbar)
    const widgetParents = process.env.WIDGET_ALLOWED_PARENTS
      ? process.env.WIDGET_ALLOWED_PARENTS.split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : ['*'] // TODO (Prod): Konkrete Origins statt * eintragen

    // Globale Content-Security-Policy
    const globalCsp = [
      "default-src 'self'",
      // Stripe + CDN; Preview/Live-Overlay (vercel.live) für Vorschau-Deployments
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://cdn.jsdelivr.net https://vercel.live",
      "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://cdn.jsdelivr.net https://vercel.live",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      // Supabase (HTTP + WebSocket), Vercel Insights, Vercel Live (WS)
      `connect-src 'self' ${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''} https://*.supabase.co wss://*.supabase.co https://vitals.vercel-insights.com https://vercel.live wss://vercel.live wss://*.vercel.live`,
      "worker-src 'self' blob:",
      "frame-src 'self' https://js.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      'upgrade-insecure-requests',
    ].join('; ')

    // CSP für den Widget-iFrame (gezielt gelockert + sandbox)
    const widgetFrameCsp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      // iFrame in Sandbox: Skripte + Same-Origin erlauben
      'sandbox allow-scripts allow-same-origin',
      // Einbettung ausdrücklich erlauben (besser: konkrete Domains statt *)
      `frame-ancestors ${widgetParents.join(' ')}`,
    ].join('; ')

    return [
      // Globale Security-Header + CSP
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

      // Ausnahme: iFrame-Route des Widgets
      {
        source: '/widget/frame/:path*',
        headers: [
          // Kein X-Frame-Options hier, wir steuern über CSP frame-ancestors
          { key: 'Content-Security-Policy', value: widgetFrameCsp },
        ],
      },

      // Public Widget-Script (CORS + Cache)
      {
        source: '/widget.js',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },

      // Widget-API (CORS freischalten, falls benötigt)
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
