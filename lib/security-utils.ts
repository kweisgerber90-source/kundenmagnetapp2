/**
 * Security utilities
 * IP hashing, sanitization, etc.
 */

/**
 * Hash an IP address with pepper from ENV
 */
export async function hashIP(ip: string): Promise<string> {
  const pepper = process.env.IP_HASH_PEPPER || 'change-me-in-production'
  const data = new TextEncoder().encode(ip + pepper)

  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  return hashHex
}

/**
 * Sanitize user input (basic)
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '').slice(0, 10000)
}

/**
 * Mask email for logging
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return '***'
  const maskedLocal = local.slice(0, 2) + '***'
  return `${maskedLocal}@${domain}`
}

/**
 * Mask IP for logging (keep first 2 octets)
 */
export function maskIP(ip: string): string {
  const parts = ip.split('.')
  if (parts.length !== 4) return '***.***.***.***'
  return `${parts[0]}.${parts[1]}.***.***`
}
