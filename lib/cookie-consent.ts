/**
 * Cookie Consent Management
 * TTDSG-compliant consent handling with early script blocking
 */

export type ConsentCategories = {
  essential: boolean // Always true, can't be disabled
  analytics: boolean
  marketing: boolean
}

export type ConsentData = {
  given: boolean
  categories: ConsentCategories
  timestamp: number
  version: string // To track policy changes
}

const CONSENT_COOKIE_NAME = 'km_consent'
const CONSENT_VERSION = '1.0' // Increment when privacy policy changes

function isProd() {
  return typeof window !== 'undefined' && location.protocol === 'https:'
}

/**
 * Read cookie string by name
 */
function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const cookie = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))
  if (!cookie) return null
  return decodeURIComponent(cookie.split('=')[1])
}

/**
 * Get current consent status from cookie
 */
export function getConsent(): ConsentData | null {
  const value = readCookie(CONSENT_COOKIE_NAME)
  if (!value) return null
  try {
    return JSON.parse(value) as ConsentData
  } catch {
    return null
  }
}

/**
 * Save consent decision to cookie
 * Also dispatch a custom event so listeners can react without full reload.
 */
export function saveConsent(categories: ConsentCategories): void {
  const data: ConsentData = {
    given: true,
    categories,
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  }

  const value = encodeURIComponent(JSON.stringify(data))
  const expires = new Date()
  expires.setFullYear(expires.getFullYear() + 1) // 1 year

  const secure = isProd() ? '; Secure' : ''
  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${secure}`

  // Notify listeners (e.g., to run unblocked scripts without reload)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('km-consent-updated', { detail: data }))
  }
}

/**
 * Check if user has given consent for this version
 */
export function hasConsent(): boolean {
  const consent = getConsent()
  return consent?.given === true && consent?.version === CONSENT_VERSION
}

/**
 * Check if specific category is consented
 */
export function hasCategoryConsent(category: keyof ConsentCategories): boolean {
  const consent = getConsent()
  if (!consent?.given) return false
  return consent.categories[category] === true
}

/**
 * Clear consent (for testing or user withdrawal)
 */
export function clearConsent(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${CONSENT_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

/**
 * EARLY BLOCKER:
 * Returns a tiny inline script string that blocks non-essential scripts
 * BEFORE they execute (to be injected into <head>).
 *
 * Usage in app/layout.tsx:
 * <script dangerouslySetInnerHTML={{ __html: earlyBlockerScript() }} />
 */
export function earlyBlockerScript(): string {
  return `
(function () {
  try {
    var name = '${CONSENT_COOKIE_NAME}=';
    var cookies = (document.cookie || '').split('; ');
    var raw = null;
    for (var i = 0; i < cookies.length; i++) {
      if (cookies[i].indexOf(name) === 0) { raw = decodeURIComponent(cookies[i].substring(name.length)); break; }
    }
    var consent = null;
    if (raw) { try { consent = JSON.parse(raw); } catch (e) {} }

    var hasGiven = consent && consent.given === true && consent.version === '${CONSENT_VERSION}';

    // Find all scripts with data-category and block non-essential
    var scripts = document.querySelectorAll('script[data-category]');
    scripts.forEach ? scripts.forEach(blocker) : Array.prototype.forEach.call(scripts, blocker);

    function blocker(script) {
      var cat = script.getAttribute('data-category');
      if (cat === 'essential') return; // keep essential
      if (hasGiven && consent.categories && consent.categories[cat]) return; // allowed category

      // If not allowed yet: prevent execution
      if (script.type !== 'text/plain') {
        script.setAttribute('type', 'text/plain');
        script.setAttribute('data-original-type', 'text/javascript');
      }
    }
  } catch (e) {
    console && console.warn && console.warn('Consent early blocker failed', e);
  }
})();`
}

/**
 * Unblock scripts after consent is given for allowed categories
 */
export function unblockScripts(categories: ConsentCategories): void {
  if (typeof document === 'undefined') return

  const scripts = document.querySelectorAll('script[data-category]')
  scripts.forEach((script) => {
    const category = script.getAttribute('data-category') as keyof ConsentCategories

    if (!categories[category]) return // category not allowed

    const originalType = script.getAttribute('data-original-type')
    if (originalType) {
      const src = script.getAttribute('src')
      const content = script.textContent || ''

      // replace with a fresh executable script
      const newScript = document.createElement('script')
      newScript.type = originalType

      // Preserve attributes that may matter (async, defer, etc.)
      ;['async', 'defer', 'nomodule', 'crossorigin', 'referrerpolicy'].forEach((attr) => {
        if (script.hasAttribute(attr)) newScript.setAttribute(attr, script.getAttribute(attr)!)
      })

      if (src) {
        newScript.src = src
      } else if (content.trim()) {
        newScript.text = content
      }

      script.parentNode?.insertBefore(newScript, script)
      script.remove()
    }
  })
}

/**
 * Log consent to backend
 */
export async function logConsent(
  categories: ConsentCategories,
  consentText: string,
  consentGiven: boolean,
): Promise<void> {
  try {
    await fetch('/api/consent/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories, consentText, consentGiven }),
      cache: 'no-store',
    })
  } catch (error) {
    console.error('Failed to log consent:', error)
  }
}
