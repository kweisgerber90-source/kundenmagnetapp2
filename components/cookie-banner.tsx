// components/cookie-banner.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCookieConsent } from '@/hooks/use-cookie-consent'
import Link from 'next/link'

export function CookieBanner() {
  const { showBanner, acceptAll, acceptEssential } = useCookieConsent()

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="mx-auto max-w-4xl p-6">
        <h3 className="mb-2 text-lg font-semibold">Cookie-Einstellungen</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten.
          Essenzielle Cookies sind für den Betrieb der Website notwendig. Mit Ihrer Zustimmung
          verwenden wir auch Analyse- und Marketing-Cookies.{' '}
          <Link href="/legal/datenschutz" className="underline hover:text-primary">
            Mehr erfahren
          </Link>
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={acceptEssential} variant="outline">
            Nur essenzielle Cookies
          </Button>
          <Button onClick={acceptAll}>Alle Cookies akzeptieren</Button>
        </div>
      </Card>
    </div>
  )
}
