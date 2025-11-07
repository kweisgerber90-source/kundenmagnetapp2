'use client'

// /app/app/abrechnung/cancel/page.tsx
/**
 * ❌ Checkout Abbruchseite
 * Wird bei Abbruch des Stripe Checkout angezeigt
 */

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, HelpCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AbrechnungCancelPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Zahlung abgebrochen</CardTitle>
          <CardDescription>Keine Sorge, es wurde nichts berechnet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-amber-200 bg-amber-50">
            <HelpCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-900">
              Sie können jederzeit einen Plan wählen und 14 Tage kostenlos testen – ohne Risiko!
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h3 className="font-semibold">Warum Kundenmagnetapp?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>14 Tage kostenlose Testphase</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>Jederzeit kündbar</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>Keine Setup-Gebühren</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>DSGVO-konform & Server in Deutschland</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={() => router.push('/pricing')} className="w-full">
              Pläne & Preise ansehen
            </Button>
            <Button variant="outline" onClick={() => router.push('/')} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zur Startseite
            </Button>
          </div>

          <div className="rounded-lg bg-muted/50 p-4 text-center text-sm">
            <p className="mb-2 font-medium">Haben Sie Fragen?</p>
            <p className="text-muted-foreground">
              Unser Support-Team hilft Ihnen gerne:{' '}
              <a href="mailto:support@kundenmagnet-app.de" className="text-primary hover:underline">
                support@kundenmagnet-app.de
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
