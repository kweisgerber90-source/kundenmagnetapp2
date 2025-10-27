// lib/url.ts
export function getBaseUrl() {
  if (typeof window !== 'undefined') return window.location.origin
  // SSR / Edge:
  return process.env.NEXT_PUBLIC_APP_BASE_URL ?? 'http://localhost:3000'
}
