/**
 * Security utilities: IP hashing, extraction, sanitization, masking.
 */

export async function hashIP(ip: string): Promise<string> {
  const pepper = process.env.IP_HASH_PEPPER
  if (!pepper) {
    console.warn('[security] IP_HASH_PEPPER is not set — dev fallback in use.')
  }
  const normalized = (ip ?? '').trim().toLowerCase()
  const data = new TextEncoder().encode(normalized + (pepper ?? 'dev-pepper'))
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/** Extract client IP: x-real-ip → x-forwarded-for(first) → request.ip → 'unknown' */
export function extractIP(
  requestIP?: string,
  forwardedFor?: string | null,
  realIP?: string | null,
): string {
  if (realIP && realIP.trim()) return realIP.trim()
  if (forwardedFor && forwardedFor.trim()) {
    const first = forwardedFor.split(',')[0]?.trim()
    if (first) return first
  }
  return requestIP?.trim() || 'unknown'
}

/** Plain-text sanitization (strip tags, collapse whitespace, length cap) */
export function sanitizeInput(input: string): string {
  return (input ?? '')
    .trim()
    .replace(/<[^>]*>/g, '') // remove any HTML tags
    .replace(/\s+/g, ' ') // collapse whitespace
    .slice(0, 10_000)
}

export function sanitizeEmail(email: string): string {
  return (email ?? '').trim().toLowerCase().slice(0, 254)
}

export function isValidEmail(email: string): boolean {
  const e = sanitizeEmail(email)
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(e) && e.length <= 254
}

/** GDPR-friendly masks */
export function maskEmail(email: string): string {
  const [local, domain] = (email ?? '').split('@')
  if (!domain) return '***@***'
  const maskedLocal = local.length > 2 ? local.slice(0, 2) + '***' : '***'
  return `${maskedLocal}@${domain}`
}

export function maskIP(ip: string): string {
  const parts = (ip ?? '').split('.')
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.***.***`
  return (ip ?? '').slice(0, 8) + '***' // IPv6-ish
}
