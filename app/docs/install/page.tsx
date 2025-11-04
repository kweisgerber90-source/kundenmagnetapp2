// app/docs/install/page.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BRAND } from '@/lib/constants'
import { CheckCircle, Download, ExternalLink, Zap } from 'lucide-react'
import Link from 'next/link'

export default function InstallDocsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">Installation & Setup</h1>
          <p className="text-xl text-muted-foreground">
            Schritt-für-Schritt Anleitung zur Einrichtung von {BRAND.name}
          </p>
        </div>

        <div className="space-y-8">
          {/* Account Setup */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  1
                </div>
                <CardTitle>Account erstellen</CardTitle>
              </div>
              <CardDescription>Registrieren Sie sich und wählen Sie Ihren Plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild>
                    <Link href="/register">
                      <Zap className="mr-2 h-4 w-4" />
                      Kostenlosen Test starten
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/pricing">
                      Preise vergleichen
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">
                    <CheckCircle className="mr-1 inline h-4 w-4 text-green-500" />
                    14 Tage kostenlos testen • Keine Kreditkarte erforderlich
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Creation */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  2
                </div>
                <CardTitle>Erste Kampagne erstellen</CardTitle>
              </div>
              <CardDescription>Richten Sie Ihre erste Bewertungskampagne ein</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="steps space-y-3">
                  <div className="flex gap-3">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Kampagne benennen</p>
                      <p className="text-xs text-muted-foreground">
                        z.B. &quot;Restaurant Hauptstraße&quot; oder &quot;Online-Shop
                        Bewertungen&quot;
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Formular anpassen</p>
                      <p className="text-xs text-muted-foreground">
                        Bestimmen Sie, welche Felder Ihre Kunden ausfüllen sollen
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Design wählen</p>
                      <p className="text-xs text-muted-foreground">
                        Passen Sie Farben und Stil an Ihr Unternehmen an
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Generation */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  3
                </div>
                <CardTitle>QR-Code generieren</CardTitle>
              </div>
              <CardDescription>Erstellen Sie QR-Codes für verschiedene Standorte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Für jeden Standort oder jede Verwendung können Sie individuelle QR-Codes
                  erstellen:
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium">Tischaufsteller</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Perfekt für Restaurants und Cafés
                    </p>
                    <p className="text-xs text-muted-foreground">Format: 10x10cm, hochauflösend</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium">Visitenkarten</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Kompakt für persönliche Kontakte
                    </p>
                    <p className="text-xs text-muted-foreground">Format: 3x3cm, vektorbasiert</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium">Plakate & Flyer</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Für größere Werbematerialien
                    </p>
                    <p className="text-xs text-muted-foreground">Format: skalierbar, PDF/SVG</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium">E-Mail Signatur</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      In jeder E-Mail automatisch dabei
                    </p>
                    <p className="text-xs text-muted-foreground">Format: Web-optimiert, PNG</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Widget Integration */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  4
                </div>
                <CardTitle>Widget einbinden</CardTitle>
              </div>
              <CardDescription>Zeigen Sie gesammelte Bewertungen auf Ihrer Website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Mit einem einfachen Code-Snippet binden Sie das Bewertungs-Widget in Ihre Website
                  ein:
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Download className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="text-sm font-medium">Code kopieren</h4>
                    <p className="text-xs text-muted-foreground">Aus dem Dashboard</p>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <div className="text-lg">📋</div>
                    </div>
                    <h4 className="text-sm font-medium">Einfügen</h4>
                    <p className="text-xs text-muted-foreground">
                      Wo Bewertungen erscheinen sollen
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <h4 className="text-sm font-medium">Fertig</h4>
                    <p className="text-xs text-muted-foreground">Bewertungen werden angezeigt</p>
                  </div>
                </div>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/docs/widget">
                    Detaillierte Widget-Anleitung
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Platform Specific */}
          <Card>
            <CardHeader>
              <CardTitle>Plattform-spezifische Installation</CardTitle>
              <CardDescription>
                Spezialisierte Anleitungen für beliebte CMS und E-Commerce Plattformen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <p className="mb-3 text-sm font-medium">
                  📚 Detaillierte Schritt-für-Schritt Anleitungen verfügbar
                </p>
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/docs/install/platforms" prefetch={false}>
                    Zu den Plattform-Anleitungen
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: 'WordPress', desc: 'Gutenberg & Elementor' },
                  { name: 'Shopify', desc: 'Theme-Integration' },
                  { name: 'Webflow', desc: 'Custom Code & Embed' },
                  { name: 'Wix', desc: 'HTML-Code einbetten' },
                  { name: 'Squarespace', desc: 'Code-Block verwenden' },
                  { name: 'Shopware', desc: 'Shopping Experiences' },
                  { name: 'React/Next.js', desc: 'Framework-Integration' },
                  { name: 'Vue/Nuxt', desc: 'Komponenten-basiert' },
                  { name: 'Statisches HTML', desc: 'Direkte Integration' },
                ].map((platform) => (
                  <Link
                    key={platform.name}
                    href="/docs/install/platforms"
                    prefetch={false}
                    className="rounded-lg border p-4 transition-colors hover:border-primary hover:bg-accent"
                  >
                    <h4 className="font-medium">{platform.name}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">{platform.desc}</p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Testing */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  5
                </div>
                <CardTitle>Testen & Live gehen</CardTitle>
              </div>
              <CardDescription>Stellen Sie sicher, dass alles funktioniert</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Test-Checkliste
                  </h4>
                  <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-200">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3" />
                      QR-Code mit Smartphone scannen
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3" />
                      Test-Bewertung abgeben
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3" />
                      Widget auf Website prüfen
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3" />
                      E-Mail-Benachrichtigungen testen
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button variant="outline">Test-Bewertung erstellen</Button>
                  <Button variant="outline">Widget-Vorschau anzeigen</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
