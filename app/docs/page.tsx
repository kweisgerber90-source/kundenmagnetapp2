// app/docs/page.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BRAND } from '@/lib/constants'
import {
  BookOpen,
  Code,
  ExternalLink,
  FileText,
  Layers,
  QrCode,
  Rocket,
  Settings,
  Zap,
} from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Dokumentation | Kundenmagnetapp',
  description:
    'Vollständige Dokumentation für Kundenmagnetapp - Installation, Widget-Integration, QR-Codes und mehr',
}

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Dokumentation</h1>
          <p className="text-xl text-muted-foreground">
            Alles was Sie brauchen, um mit {BRAND.name} durchzustarten
          </p>
        </div>

        {/* Schnellstart */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Rocket className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Schnellstart</CardTitle>
            </div>
            <CardDescription>In wenigen Minuten zu Ihren ersten Bewertungen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col items-start gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  1
                </div>
                <h3 className="font-semibold">Kampagne erstellen</h3>
                <p className="text-sm text-muted-foreground">
                  Erstellen Sie Ihre erste Kampagne und passen Sie das Formular an
                </p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  2
                </div>
                <h3 className="font-semibold">Bewertungen sammeln</h3>
                <p className="text-sm text-muted-foreground">
                  Teilen Sie den Link oder QR-Code mit Ihren Kunden
                </p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  3
                </div>
                <h3 className="font-semibold">Widget einbinden</h3>
                <p className="text-sm text-muted-foreground">
                  Zeigen Sie Bewertungen auf Ihrer Website mit einem Code-Snippet
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hauptdokumentation - Grid */}
        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-bold">Dokumentations-Bereiche</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Installation & Setup */}
            <Card className="group transition-all hover:border-primary hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Settings className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Installation & Setup</CardTitle>
                      <CardDescription className="mt-1">
                        Schritt-für-Schritt Einrichtung
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Komplette Anleitung zur Einrichtung von {BRAND.name} - vom Account bis zum ersten
                  Widget
                </p>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" asChild className="w-full justify-between">
                    <Link href="/docs/install">
                      <span>Allgemeine Installation</span>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="w-full justify-between border-primary/20 bg-primary/5 hover:bg-primary/10"
                  >
                    <Link href="/docs/install/platforms">
                      <span>Plattform-spezifische Anleitungen</span>
                      <Zap className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground">
                    <strong>Enthält:</strong> Account erstellen, Kampagnen, QR-Codes, Widget
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Widget Integration */}
            <Card className="group transition-all hover:border-primary hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-500/10 p-2">
                      <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle>Widget Integration</CardTitle>
                      <CardDescription className="mt-1">
                        Bewertungen auf Ihrer Website
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Technische Details zur Widget-Integration und Anpassung
                </p>
                <Button variant="outline" asChild className="w-full justify-between">
                  <Link href="/docs/widget">
                    <span>Widget-Dokumentation</span>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground">
                    <strong>Enthält:</strong> Code-Snippets, Anpassung, WordPress, Shopify
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* QR-Codes */}
            <Card className="group transition-all hover:border-primary hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-500/10 p-2">
                      <QrCode className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle>QR-Codes</CardTitle>
                      <CardDescription className="mt-1">
                        Bewertungen offline sammeln
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Erstellen, anpassen und verwalten Sie QR-Codes für verschiedene Standorte
                </p>
                <Button variant="outline" asChild className="w-full justify-between">
                  <Link href="/docs/qr">
                    <span>QR-Code Dokumentation</span>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground">
                    <strong>Enthält:</strong> Erstellung, Download-Formate, Tracking, Druck
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Plattform-Guides (Featured) */}
            <Card className="group border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent transition-all hover:border-primary hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/20 p-2">
                      <Layers className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Plattform-Anleitungen
                        <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                          Neu
                        </span>
                      </CardTitle>
                      <CardDescription className="mt-1">18 Plattformen im Detail</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Detaillierte Schritt-für-Schritt Anleitungen für WordPress, Shopify, Webflow,
                  React/Next.js und mehr
                </p>
                <Button asChild className="w-full">
                  <Link href="/docs/install/platforms">
                    <Zap className="mr-2 h-4 w-4" />
                    Plattform-Guides ansehen
                  </Link>
                </Button>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="rounded border bg-background p-2 text-center text-xs">
                    WordPress
                  </div>
                  <div className="rounded border bg-background p-2 text-center text-xs">
                    Shopify
                  </div>
                  <div className="rounded border bg-background p-2 text-center text-xs">React</div>
                  <div className="rounded border bg-background p-2 text-center text-xs">
                    Webflow
                  </div>
                  <div className="rounded border bg-background p-2 text-center text-xs">Vue.js</div>
                  <div className="rounded border bg-background p-2 text-center text-xs">
                    +13 mehr
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Zusätzliche Ressourcen */}
        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-bold">Weitere Ressourcen</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">API-Referenz</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm text-muted-foreground">
                  Technische API-Dokumentation für Entwickler
                </p>
                <Button variant="outline" size="sm" disabled>
                  Bald verfügbar
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Beispiele</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm text-muted-foreground">
                  Code-Beispiele und Best Practices
                </p>
                <Button variant="outline" size="sm" disabled>
                  Bald verfügbar
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Support</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm text-muted-foreground">
                  Brauchen Sie Hilfe? Kontaktieren Sie uns
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:${BRAND.email.support}`}>E-Mail Support</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hilfe-Hinweis */}
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20">
          <CardContent className="flex items-start gap-4 pt-6">
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/50">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                Finden Sie nicht was Sie suchen?
              </h3>
              <p className="mb-3 text-sm text-blue-800 dark:text-blue-200">
                Unsere Dokumentation wird ständig erweitert. Wenn Sie Hilfe benötigen oder
                Vorschläge haben, kontaktieren Sie uns gerne.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href={`mailto:${BRAND.email.support}`}>
                  Kontakt aufnehmen
                  <ExternalLink className="ml-2 h-3 w-3" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
