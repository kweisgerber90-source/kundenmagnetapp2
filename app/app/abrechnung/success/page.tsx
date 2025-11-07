'use client'

// /app/app/abrechnung/success/page.tsx
/**
 * ✅ Checkout Erfolgsseite
 * Wird nach erfolgreichem Stripe Checkout angezeigt
 */

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AbrechnungSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id') || ''

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Willkommen bei Kundenmagnetapp 🎉</CardTitle>
          <CardDescription>Ihre Zahlung war erfolgreich</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {sessionId && (
            <p className="text-center text-sm text-muted-foreground">Session-ID: {sessionId}</p>
          )}

          <div className="space-y-3">
            <h3 className="font-semibold">Was passiert jetzt?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>Sie haben 14 Tage kostenlose Testphase</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>Sie erhalten eine Bestätigungs-E-Mail</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>Sie können sofort mit dem Sammeln von Bewertungen starten</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={() => router.push('/app')} className="w-full">
              Zum Dashboard
            </Button>
            <Button
              onClick={() => router.push('/app/abrechnung')}
              className="w-full"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zur Abrechnung
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
