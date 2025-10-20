// next.config.js  (CommonJS, Kommentare auf Deutsch)
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Aktiviert Strict Mode für React
  reactStrictMode: true,

  // Entfernt den "X-Powered-By"-Header
  poweredByHeader: false,

  // Bildkonfiguration (lokal unoptimiert, in Prod optimiert Vercel)
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // Optionale Next-Experimente
  experimental: {
    typedRoutes: true,
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
      // In Prod möglichst 'unsafe-inline'/'unsafe-eval' reduzieren/entfernen
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.stripe.com https://*.supabase.co wss://*.supabase.co",
      "frame-src 'self' https://js.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'", // Global: keine Einbettung erlaubt
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
