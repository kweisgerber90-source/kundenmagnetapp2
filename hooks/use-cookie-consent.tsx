// hooks/use-cookie-consent.tsx
'use client'

import { ConsentData, getConsent, hasConsent, saveConsent } from '@/lib/cookie-consent'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

interface CookieConsentContextValue {
  consent: ConsentData | null
  showBanner: boolean
  acceptAll: () => void
  acceptEssential: () => void
  updateConsent: (updates: Partial<Omit<ConsentData, 'version' | 'timestamp'>>) => void
  hasConsent: (type: 'essential' | 'analytics' | 'marketing') => boolean
}

const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(undefined)

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsentState] = useState<ConsentData | null>(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const stored = getConsent()
    setConsentState(stored)
    setShowBanner(!stored)
  }, [])

  const acceptAll = () => {
    const categories = {
      essential: true,
      analytics: true,
      marketing: true,
    }
    saveConsent(categories)
    const newConsent = getConsent()
    setConsentState(newConsent)
    setShowBanner(false)
  }

  const acceptEssential = () => {
    const categories = {
      essential: true,
      analytics: false,
      marketing: false,
    }
    saveConsent(categories)
    const newConsent = getConsent()
    setConsentState(newConsent)
    setShowBanner(false)
  }

  const updateConsent = (updates: Partial<Omit<ConsentData, 'version' | 'timestamp'>>) => {
    const current = consent || {
      given: false,
      categories: {
        essential: true,
        analytics: false,
        marketing: false,
      },
    }

    const newCategories = {
      essential: updates.categories?.essential ?? current.categories.essential,
      analytics: updates.categories?.analytics ?? current.categories.analytics,
      marketing: updates.categories?.marketing ?? current.categories.marketing,
    }

    saveConsent(newCategories)
    const newConsent = getConsent()
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
