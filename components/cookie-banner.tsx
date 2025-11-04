'use client'

import {
  getConsent,
  logConsent,
  saveConsent,
  unblockScripts,
  type ConsentCategories,
} from '@/lib/cookie-consent'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

export function CookieBanner() {
  // FRÜHER Check: Wenn im iFrame, rendere gar nicht erst
  const [isInIframe] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.self !== window.top
  })

  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [categories, setCategories] = useState<ConsentCategories>({
    essential: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    const consent = getConsent()
    if (!consent?.given) setIsVisible(true)

    // Optional: Listen and unblock without reload
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { categories: ConsentCategories } | undefined
      if (detail?.categories) unblockScripts(detail.categories)
    }
    window.addEventListener('km-consent-updated', handler as EventListener)
    return () => window.removeEventListener('km-consent-updated', handler as EventListener)
  }, [])

  // Wenn im iFrame, rendere nichts
  if (isInIframe) return null

  const consentText = `Wir verwenden Cookies, um Ihre Erfahrung zu verbessern. Essenzielle Cookies sind für die Funktion der Website erforderlich. Analytics-Cookies helfen uns, die Nutzung zu verstehen. Marketing-Cookies werden für personalisierte Werbung verwendet. Sie können Ihre Einstellungen jederzeit in den Datenschutzeinstellungen ändern.`

  const handleAcceptAll = async () => {
    const all: ConsentCategories = { essential: true, analytics: true, marketing: true }
    saveConsent(all)
    unblockScripts(all)
    await logConsent(all, consentText, true)
    setIsVisible(false)
  }

  const handleAcceptSelected = async () => {
    saveConsent(categories)
    unblockScripts(categories)
    await logConsent(categories, consentText, true)
    setIsVisible(false)
  }

  const handleRejectAll = async () => {
    const essentialOnly: ConsentCategories = { essential: true, analytics: false, marketing: false }
    saveConsent(essentialOnly)
    await logConsent(essentialOnly, consentText, false)
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white shadow-lg">
      <div className="container relative mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold">🍪 Cookie-Einstellungen</h3>
            <p className="mb-4 text-sm text-gray-600">
              Wir verwenden Cookies, um Ihre Erfahrung zu verbessern. Sie können Ihre Präferenzen
              jederzeit anpassen.
            </p>

            {showDetails && (
              <div className="mb-4 space-y-3">
                <label className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                  <input type="checkbox" checked={categories.essential} disabled className="mt-1" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Essenzielle Cookies</div>
                    <div className="text-xs text-gray-600">
                      Erforderlich für die grundlegende Funktionalität der Website. Kann nicht
                      deaktiviert werden.
                    </div>
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={categories.analytics}
                    onChange={(e) => setCategories((p) => ({ ...p, analytics: e.target.checked }))}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Analytics-Cookies</div>
                    <div className="text-xs text-gray-600">
                      Helfen uns zu verstehen, wie Sie die Website nutzen.
                    </div>
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={categories.marketing}
                    onChange={(e) => setCategories((p) => ({ ...p, marketing: e.target.checked }))}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Marketing-Cookies</div>
                    <div className="text-xs text-gray-600">
                      Ermöglichen personalisierte Werbung und Tracking über mehrere Websites.
                    </div>
                  </div>
                </label>
              </div>
            )}

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-blue-600 hover:underline"
            >
              {showDetails ? 'Weniger anzeigen' : 'Einstellungen anpassen'}
            </button>
          </div>

          <div className="flex flex-col gap-2 md:min-w-[200px]">
            {showDetails ? (
              <>
                <button
                  onClick={handleAcceptSelected}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Auswahl speichern
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-300"
                >
                  Alle akzeptieren
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Nur essenzielle
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleAcceptAll}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Alle akzeptieren
                </button>
                <button
                  onClick={handleRejectAll}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-300"
                >
                  Nur essenzielle
                </button>
              </>
            )}
          </div>
        </div>

        <button
          onClick={handleRejectAll}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          aria-label="Schließen"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
