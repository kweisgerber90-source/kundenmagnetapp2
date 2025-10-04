// lib/cookie-consent.ts
import { COOKIE_CONSENT_KEY, COOKIE_CONSENT_VERSION } from '@/lib/constants'

export interface CookieConsent {
  essential: boolean
  analytics: boolean
  marketing: boolean
  version: string
  timestamp: string
  consentText: string
}

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!stored) return null

    const consent = JSON.parse(stored) as CookieConsent
    if (consent.version !== COOKIE_CONSENT_VERSION) return null

    return consent
  } catch {
    return null
  }
}

export function setCookieConsent(consent: Omit<CookieConsent, 'version' | 'timestamp'>) {
  const fullConsent: CookieConsent = {
    ...consent,
    version: COOKIE_CONSENT_VERSION,
    timestamp: new Date().toISOString(),
  }

  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(fullConsent))

  // Trigger custom event for other scripts to listen to
  window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: fullConsent }))

  return fullConsent
}

export function hasConsent(
  type: keyof Pick<CookieConsent, 'essential' | 'analytics' | 'marketing'>,
): boolean {
  const consent = getCookieConsent()
  if (!consent) return false
  return consent[type]
}

export function clearCookieConsent() {
  localStorage.removeItem(COOKIE_CONSENT_KEY)
  // Remove all non-essential cookies
  document.cookie.split(';').forEach((c) => {
    const eqPos = c.indexOf('=')
    const name = eqPos > -1 ? c.substring(0, eqPos).trim() : c.trim()
    if (name && !name.startsWith('km_essential_')) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
    }
  })
}
