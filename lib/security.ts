// lib/security.ts
import { getEnv } from './env'

/**
 * Get crypto implementation (Web Crypto API only for Edge Runtime compatibility)
 */
function getCrypto() {
  if (typeof window !== 'undefined') {
    return window.crypto
  }
  // Use global crypto for Node.js/Edge Runtime
  return globalThis.crypto
}

/**
 * Hash IP address with pepper for privacy
 * Uses a simple non-cryptographic hash for Edge Runtime compatibility
 */
export function hashIP(ip: string): string {
  const env = getEnv()
  const pepper = env.IP_HASH_PEPPER || 'fallback-pepper-for-dev'

  // Simple hash for Edge Runtime compatibility
  const data = new TextEncoder().encode(ip + pepper)
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data[i]
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16)
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  const crypto = getCrypto()

  // Web Crypto API
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Verify CSRF token
 */
export function verifyCSRFToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) return false

  // Simple comparison (timing-safe comparison not available in Web Crypto API)
  return token === storedToken
}

/**
 * Sanitize user input (basic XSS prevention)
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Rate limiting check (simple in-memory)
 * In production, use Redis or similar
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60000,
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  // Clean up expired entries
  if (record && record.resetAt < now) {
    rateLimitMap.delete(identifier)
  }

  // Check or create record
  if (!record || record.resetAt < now) {
    const resetAt = now + windowMs
    rateLimitMap.set(identifier, { count: 1, resetAt })
    return { allowed: true, remaining: limit - 1, resetAt }
  }

  // Increment count
  record.count++
  const allowed = record.count <= limit
  const remaining = Math.max(0, limit - record.count)

  return { allowed, remaining, resetAt: record.resetAt }
}

/**
 * Extract client IP from request headers
 */
export function getClientIP(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0] ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    '0.0.0.0'
  )
}

/**
 * Security headers helper
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
} as const
