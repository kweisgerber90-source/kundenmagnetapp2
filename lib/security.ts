/**
 * Security utilities - CSRF tokens
 */

/**
 * Generate a random CSRF token
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Verify CSRF token (constant-time comparison)
 */
export function verifyCSRFToken(token1: string, token2: string): boolean {
  if (!token1 || !token2) return false
  if (token1.length !== token2.length) return false

  let result = 0
  for (let i = 0; i < token1.length; i++) {
    result |= token1.charCodeAt(i) ^ token2.charCodeAt(i)
  }
  return result === 0
}
