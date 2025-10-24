// /lib/widget/config.ts
export const WIDGET_CONFIG = {
  version: '1.0.0',
  apiUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://kundenmagnet-app.de',
  cacheKey: 'km_widget_cache',
  cacheTTL: 5 * 60 * 1000, // 5 Minuten
  rateLimit: {
    requests: 100,
    windowMs: 60 * 60 * 1000, // 1 Stunde
  },
  defaults: {
    limit: 10,
    sort: 'newest',
    theme: 'light',
    showRating: true,
    animation: true,
  },
  maxLimit: 50,
  allowedOrigins: [
    'https://kundenmagnet-app.de',
    'http://localhost:3000',
    // Weitere Domains können hier hinzugefügt werden
  ],
}

export const WIDGET_THEMES = {
  light: {
    primary: '#4f8ef7',
    bg: '#ffffff',
    text: '#1a1a1a',
    border: '#e5e5e5',
    star: '#fbbf24',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    primary: '#4f8ef7',
    bg: '#1f2937',
    text: '#f9fafb',
    border: '#374151',
    star: '#fbbf24',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
}
