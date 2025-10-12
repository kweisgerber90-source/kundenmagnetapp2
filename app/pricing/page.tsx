import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AlertCircle, Check, Info, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="bg-gradient-to-b from-white via-blue-50/20 to-white py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold">Einfache, transparente Preise</h1>
          <p className="mb-6 text-lg text-gray-600">
            Wählen Sie den Plan, der zu Ihrem Unternehmen passt. Jederzeit kündbar.
          </p>

          {/* VAT Notice - Prominent */}
          <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-6 py-3">
            <Info className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">Alle Preise zzgl. 19% MwSt.</span>
          </div>

          {/* B2B Notice */}
          <div className="mx-auto max-w-2xl rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
            <p className="text-sm text-gray-700">
              <strong>Für Unternehmen:</strong> Nettopreise für B2B-Kunden. Die Mehrwertsteuer wird
              beim Checkout basierend auf Ihrem Land automatisch berechnet und auf der Rechnung
              ausgewiesen.
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-3">
          {/* Starter */}
          <Card className="relative overflow-hidden transition-all hover:scale-105">
            <CardHeader>
              <CardTitle>Starter</CardTitle>
              <CardDescription>Perfekt für Einzelunternehmer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">9</span>
                  <span className="text-2xl">€</span>
                  <span className="text-gray-600">/Monat</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">zzgl. 19% MwSt. (10,71 € inkl. MwSt.)</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span className="text-sm">1 Kampagne</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span className="text-sm">Einfache Widget-Integration</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span className="text-sm">Basis-QR-Codes</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span className="text-sm">E-Mail Support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full hover:shadow-md" variant="outline" asChild>
                <Link href="/register?plan=starter">Jetzt starten</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Pro */}
          <Card className="relative overflow-hidden border-2 border-blue-500 shadow-xl transition-all hover:scale-105">
            <div className="absolute -right-8 top-6 rotate-45 bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-1 text-xs font-semibold text-white shadow-sm">
              BELIEBT
            </div>
            <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardTitle>Pro</CardTitle>
              <CardDescription>Für wachsende Unternehmen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">19</span>
                  <span className="text-2xl">€</span>
                  <span className="text-gray-600">/Monat</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">zzgl. 19% MwSt. (22,61 € inkl. MwSt.)</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span className="text-sm">Bis zu 10 Kampagnen</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span className="text-sm">Erweiterte Widgets</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span className="text-sm">QR-Tracking mit Statistiken</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span className="text-sm">CSV-Export</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span className="text-sm">Priority Support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                asChild
              >
                <Link href="/register?plan=pro">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Jetzt starten
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Business */}
          <Card className="relative overflow-hidden transition-all hover:scale-105">
            <CardHeader>
              <CardTitle>Business</CardTitle>
              <CardDescription>Für Agenturen & größere Teams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">39</span>
                  <span className="text-2xl">€</span>
                  <span className="text-gray-600">/Monat</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">zzgl. 19% MwSt. (46,41 € inkl. MwSt.)</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span className="text-sm">Unbegrenzte Kampagnen</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span className="text-sm">White-Label Option</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span className="text-sm">Erweiterte Moderation & Reporting</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span className="text-sm">API-Zugang</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span className="text-sm">Dedizierter Support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full hover:shadow-md" variant="outline" asChild>
                <Link href="/register?plan=business">Jetzt starten</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* VAT Info Section */}
        <div className="mx-auto mt-12 max-w-4xl">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-blue-100 p-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 font-semibold text-gray-900">
                  Informationen zur Mehrwertsteuer
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <strong>Für deutsche Unternehmen:</strong> Die ausgewiesene Mehrwertsteuer (19%)
                    wird automatisch zu den Nettopreisen addiert und auf Ihrer Rechnung ausgewiesen.
                  </p>
                  <p>
                    <strong>Für EU-Unternehmen mit USt-ID:</strong> Reverse-Charge-Verfahren – keine
                    deutsche MwSt. wird berechnet (bitte USt-ID beim Checkout angeben).
                  </p>
                  <p>
                    <strong>Für Nicht-EU-Unternehmen:</strong> Keine deutsche MwSt. wird berechnet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mx-auto mt-12 max-w-4xl">
          <h2 className="mb-6 text-center text-2xl font-bold">Häufige Fragen zu den Preisen</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-2 font-semibold">Kann ich jederzeit kündigen?</h3>
              <p className="text-sm text-gray-600">
                Ja, Sie können monatlich kündigen. Es gibt keine versteckten Gebühren oder
                langfristige Bindung.
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-2 font-semibold">Gibt es eine kostenlose Testphase?</h3>
              <p className="text-sm text-gray-600">
                Ja, alle Pläne können 14 Tage kostenlos getestet werden. Keine Kreditkarte
                erforderlich.
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-2 font-semibold">Welche Zahlungsmethoden akzeptieren Sie?</h3>
              <p className="text-sm text-gray-600">
                Wir akzeptieren Kreditkarte, SEPA-Lastschrift und auf Anfrage auch Rechnung für
                größere Unternehmen.
              </p>
            </div>
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-2 font-semibold">Kann ich zwischen Plänen wechseln?</h3>
              <p className="text-sm text-gray-600">
                Ja, Sie können jederzeit upgraden oder downgraden. Die Abrechnung wird anteilig
                angepasst.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mx-auto mt-12 max-w-3xl text-center">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <h2 className="mb-4 text-2xl font-bold">Noch unsicher?</h2>
            <p className="mb-6 text-blue-100">
              Testen Sie Kundenmagnetapp 14 Tage kostenlos. Keine Kreditkarte erforderlich,
              jederzeit kündbar.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register">14 Tage kostenlos testen</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white bg-transparent text-white hover:bg-white/10"
                asChild
              >
                <Link href="/demo">Live Demo ansehen</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
