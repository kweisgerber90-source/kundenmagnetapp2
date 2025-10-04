// hooks/use-cookie-consent.tsx
'use client'

import { CookieConsent, getCookieConsent, hasConsent, setCookieConsent } from '@/lib/cookie-consent'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

interface CookieConsentContextValue {
  consent: CookieConsent | null
  showBanner: boolean
  acceptAll: () => void
  acceptEssential: () => void
  updateConsent: (consent: Partial<Omit<CookieConsent, 'version' | 'timestamp'>>) => void
  hasConsent: (type: 'essential' | 'analytics' | 'marketing') => boolean
}

const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(undefined)

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsentState] = useState<CookieConsent | null>(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const stored = getCookieConsent()
    setConsentState(stored)
    setShowBanner(!stored)
  }, [])

  const acceptAll = () => {
    const newConsent = setCookieConsent({
      essential: true,
      analytics: true,
      marketing: true,
      consentText: 'Nutzer hat alle Cookies akzeptiert',
    })
    setConsentState(newConsent)
    setShowBanner(false)
  }

  const acceptEssential = () => {
    const newConsent = setCookieConsent({
      essential: true,
      analytics: false,
      marketing: false,
      consentText: 'Nutzer hat nur essenzielle Cookies akzeptiert',
    })
    setConsentState(newConsent)
    setShowBanner(false)
  }

  const updateConsent = (updates: Partial<Omit<CookieConsent, 'version' | 'timestamp'>>) => {
    const current = consent || {
      essential: true,
      analytics: false,
      marketing: false,
      consentText: '',
    }
    const newConsent = setCookieConsent({
      ...current,
      ...updates,
      consentText:
        updates.consentText || `Nutzer hat Einstellungen geändert: ${JSON.stringify(updates)}`,
    })
    setConsentState(newConsent)
  }

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        showBanner,
        acceptAll,
        acceptEssential,
        updateConsent,
        hasConsent,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext)
  if (!context) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider')
  }
  return context
}
