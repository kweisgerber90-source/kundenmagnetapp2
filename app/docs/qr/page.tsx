// app/docs/qr/page.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BRAND } from '@/lib/constants'
import {
  ArrowRight,
  CheckCircle,
  Download,
  ExternalLink,
  QrCode,
  Smartphone,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'

export default function QRDocsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
          <QrCode className="h-8 w-8 text-indigo-600" />
        </div>
        <h1 className="mb-4 text-4xl font-bold">QR-Code Dokumentation</h1>
        <p className="text-xl text-gray-600">
          Sammeln Sie Bewertungen offline mit personalisierten QR-Codes
        </p>
      </div>

      {/* Quick Start */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Schnellstart in 3 Schritten</CardTitle>
          <CardDescription>So erstellen Sie Ihren ersten QR-Code</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
              1
            </div>
            <div>
              <h3 className="font-semibold">Kampagne auswählen</h3>
              <p className="text-gray-600">
                Wählen Sie eine bestehende Bewertungskampagne oder erstellen Sie eine neue.
              </p>
              <Button variant="link" asChild className="mt-2 h-auto p-0">
                <Link href="/app/kampagnen">
                  Zu den Kampagnen <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
              2
            </div>
            <div>
              <h3 className="font-semibold">QR-Code erstellen</h3>
              <p className="text-gray-600">
                Geben Sie dem QR-Code einen Namen und passen Sie optional das Design an.
              </p>
              <Button variant="link" asChild className="mt-2 h-auto p-0">
                <Link href="/app/qr/new">
                  Neuen QR-Code erstellen <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
              3
            </div>
            <div>
              <h3 className="font-semibold">Herunterladen & Drucken</h3>
              <p className="text-gray-600">
                Laden Sie den QR-Code als PNG oder SVG herunter und drucken Sie ihn aus.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wie funktioniert es? */}
      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold">Wie funktioniert es?</h2>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <Smartphone className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle>1. Kunde scannt den QR-Code</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Ihre Kunden scannen den QR-Code mit ihrem Smartphone. Jedes moderne Smartphone kann
                QR-Codes direkt mit der Kamera-App scannen – keine zusätzliche App nötig.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <ExternalLink className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle>2. Automatische Weiterleitung</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Der QR-Code leitet automatisch zu Ihrem Bewertungsformular weiter. Die URL ist kurz
                und einfach: <code className="rounded bg-gray-100 px-2 py-1">/q/abc123</code>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle>3. Tracking & Statistiken</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Alle Scans werden anonymisiert getrackt. Sie sehen, wie oft jeder QR-Code gescannt
                wurde und können den Erfolg Ihrer Kampagnen messen.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Verwendungsszenarien */}
      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold">Verwendungsszenarien</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant & Gastronomie</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
                  <span>QR-Code auf jedem Tisch</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
                  <span>QR-Code auf der Rechnung</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
                  <span>QR-Code am Eingang</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Einzelhandel</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
                  <span>QR-Code an der Kasse</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
                  <span>QR-Code auf Kassenbon</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
                  <span>QR-Code im Schaufenster</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dienstleister</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
                  <span>QR-Code auf Visitenkarten</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
                  <span>QR-Code in E-Mail-Signatur</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
                  <span>QR-Code auf Rechnungen</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Events & Messen</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
                  <span>QR-Code auf Rollups</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
                  <span>QR-Code auf Flyern</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
                  <span>QR-Code auf Namensschildern</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold">Best Practices</h2>

        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="flex gap-3">
              <Download className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
              <div>
                <h3 className="font-semibold">Richtige Größe wählen</h3>
                <p className="text-gray-600">
                  Mindestens 3x3 cm für gedruckte QR-Codes. Je größer, desto besser scannbar.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
              <div>
                <h3 className="font-semibold">Kontrast beachten</h3>
                <p className="text-gray-600">
                  Dunkler QR-Code auf hellem Hintergrund funktioniert am besten. Vermeiden Sie
                  geringe Kontraste.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <ExternalLink className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
              <div>
                <h3 className="font-semibold">Call-to-Action hinzufügen</h3>
                <p className="text-gray-600">
                  Fügen Sie einen Text hinzu wie Scannen Sie den QR-Code für eine Bewertung oder
                  Ihre Meinung zählt!
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
              <div>
                <h3 className="font-semibold">Mehrere QR-Codes verwenden</h3>
                <p className="text-gray-600">
                  Erstellen Sie unterschiedliche QR-Codes für verschiedene Standorte, um zu sehen,
                  wo die meisten Bewertungen herkommen.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Technische Details */}
      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold">Technische Details</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Formate</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <strong>SVG:</strong> Vektorgrafik für Druck und große Formate
                </li>
                <li>
                  <strong>PNG:</strong> Rastergrafik für digitale Verwendung (1024x1024px)
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Datenschutz</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• Keine Speicherung von IP-Adressen</li>
                <li>• Anonymisiertes Tracking</li>
                <li>• DSGVO-konform</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardContent className="py-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Bereit, loszulegen?</h2>
          <p className="mb-6 text-gray-600">
            Erstellen Sie jetzt Ihren ersten QR-Code und sammeln Sie mehr Bewertungen.
          </p>
          <div className="flex justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/app/qr/new">
                <QrCode className="mr-2 h-5 w-5" />
                Ersten QR-Code erstellen
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/app/qr">Zur Übersicht</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Support Link */}
      <div className="mt-12 text-center text-sm text-gray-600">
        Haben Sie Fragen? Kontaktieren Sie uns unter{' '}
        <a href={`mailto:${BRAND.supportEmail}`} className="text-indigo-600 hover:underline">
          {BRAND.supportEmail}
        </a>
      </div>
    </div>
  )
}
