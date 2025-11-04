// app/docs/install/platforms/page.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BRAND } from '@/lib/constants'
import { AlertCircle, Code, Copy, ExternalLink, Globe, Layers, Plug } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Plattform-spezifische Installation | Kundenmagnetapp Dokumentation',
  description:
    'Detaillierte Schritt-für-Schritt Anleitungen zur Widget-Installation für WordPress, Shopify, Webflow, Wix und weitere Plattformen',
}

export default function PlatformInstallDocsPage() {
  const widgetScriptUrl = `https://${BRAND.domain}/widget.js`

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/docs/install"
            className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            ← Zurück zur Installation
          </Link>
          <h1 className="mb-4 text-4xl font-bold">Plattform-spezifische Installation</h1>
          <p className="text-xl text-muted-foreground">
            Detaillierte Anleitungen für Ihre Website-Plattform – vom Anfänger bis zum Entwickler
          </p>
        </div>

        {/* Quick Navigation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Schnellnavigation</CardTitle>
            <CardDescription>Wählen Sie Ihre Plattform aus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: 'WordPress', href: '#wordpress', icon: '📝' },
                { name: 'Shopify', href: '#shopify', icon: '🛍️' },
                { name: 'Webflow', href: '#webflow', icon: '🎨' },
                { name: 'Wix', href: '#wix', icon: '✨' },
                { name: 'Squarespace', href: '#squarespace', icon: '🔲' },
                { name: 'Shopware', href: '#shopware', icon: '🛒' },
                { name: 'Jimdo', href: '#jimdo', icon: '🌐' },
                { name: 'IONOS', href: '#ionos', icon: '☁️' },
                { name: 'Framer', href: '#framer', icon: '⚡' },
                { name: 'Carrd', href: '#carrd', icon: '📄' },
                { name: 'Statisch / HTML', href: '#static', icon: '💻' },
                { name: 'React/Next.js', href: '#react', icon: '⚛️' },
              ].map((platform) => (
                <a
                  key={platform.name}
                  href={platform.href}
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:border-primary hover:bg-accent"
                >
                  <span className="text-2xl">{platform.icon}</span>
                  <span className="text-sm font-medium">{platform.name}</span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Phase 1: No-Code / Low-Code Plattformen */}
        <div className="mb-12">
          <div className="mb-6 flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Phase 1: Website-Baukästen</h2>
          </div>

          <div className="space-y-8">
            {/* WordPress */}
            <Card id="wordpress" className="scroll-mt-20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <span>📝</span> WordPress
                    </CardTitle>
                    <CardDescription>
                      Perfekt für Blogs, Unternehmenswebsites und Online-Shops mit WooCommerce
                    </CardDescription>
                  </div>
                  <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    Empfohlen
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="manual" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="plugin">Plugin (in Planung)</TabsTrigger>
                    <TabsTrigger value="manual">Manueller Code</TabsTrigger>
                  </TabsList>

                  <TabsContent value="plugin" className="space-y-4">
                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
                      <div className="flex gap-2">
                        <Plug className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Bald verfügbar: Offizielles Plugin
                          </p>
                          <p className="mt-1 text-xs text-blue-800 dark:text-blue-200">
                            Wir arbeiten an einem offiziellen WordPress-Plugin. Nutzen Sie vorerst
                            die manuelle Installation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="manual" className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                          1
                        </div>
                        <div className="flex-1">
                          <h4 className="mb-2 font-medium">Widget-ID aus Dashboard kopieren</h4>
                          <p className="text-sm text-muted-foreground">
                            Gehen Sie in Ihr {BRAND.name} Dashboard → Widget → Kampagnen-ID kopieren
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                          2
                        </div>
                        <div className="flex-1">
                          <h4 className="mb-2 font-medium">Im Theme einfügen</h4>
                          <p className="mb-3 text-sm text-muted-foreground">
                            <strong>Option A: Gutenberg Block Editor</strong>
                          </p>
                          <ul className="mb-4 space-y-1 text-sm text-muted-foreground">
                            <li>• Öffnen Sie die Seite/den Beitrag im Editor</li>
                            <li>
                              • Fügen Sie einen <strong>&quot;Custom HTML&quot;</strong> Block hinzu
                            </li>
                            <li>• Fügen Sie den Code unten ein</li>
                          </ul>

                          <div className="relative">
                            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                              <code>{`<!-- Widget-Script laden -->
<script src="${widgetScriptUrl}" defer></script>

<!-- Widget-Container -->
<div 
  data-kundenmagnet-campaign="IHRE-KAMPAGNEN-ID"
  data-theme="light"
  data-limit="6"
  data-layout="grid"
></div>`}</code>
                            </pre>
                            <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                          3
                        </div>
                        <div className="flex-1">
                          <h4 className="mb-2 font-medium">Häufige Probleme beheben</h4>
                          <div className="space-y-3 text-sm">
                            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900 dark:bg-yellow-950/20">
                              <p className="font-medium text-yellow-900 dark:text-yellow-100">
                                ⚠️ Widget wird nicht angezeigt
                              </p>
                              <ul className="mt-2 space-y-1 text-xs text-yellow-800 dark:text-yellow-200">
                                <li>
                                  • <strong>Caching-Plugins</strong> (z.B. WP Rocket): Cache leeren
                                </li>
                                <li>
                                  • <strong>Minify-Plugins</strong>: Script von Minification
                                  ausschließen
                                </li>
                                <li>• Browser-Konsole prüfen (F12) auf Fehler</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Shopify */}
            <Card id="shopify" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>🛍️</span> Shopify
                </CardTitle>
                <CardDescription>
                  Ideal für E-Commerce: Zeigen Sie Bewertungen auf Produktseiten
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium">Theme-Editor öffnen</h4>
                      <p className="text-sm text-muted-foreground">
                        Shopify Admin → <strong>Onlineshop → Themes → Code bearbeiten</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium">Script in theme.liquid einfügen</h4>
                      <p className="mb-3 text-sm text-muted-foreground">
                        Öffnen Sie <code>Layout → theme.liquid</code> und fügen Sie vor{' '}
                        <code>&lt;/head&gt;</code> ein:
                      </p>
                      <div className="relative">
                        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                          <code>{`<script src="${widgetScriptUrl}" defer></script>`}</code>
                        </pre>
                        <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      3
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium">Widget auf Produktseiten platzieren</h4>
                      <p className="mb-3 text-sm text-muted-foreground">
                        Öffnen Sie <code>Sections → product-template.liquid</code> und fügen Sie
                        nach der Produktbeschreibung ein:
                      </p>
                      <div className="relative">
                        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                          <code>{`<div 
  data-kundenmagnet-campaign="IHRE-KAMPAGNEN-ID"
  data-theme="light"
  data-limit="3"
></div>`}</code>
                        </pre>
                        <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Webflow */}
            <Card id="webflow" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>🎨</span> Webflow
                </CardTitle>
                <CardDescription>
                  Für Designer und Agenturen – visuell und professionell
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium">Custom Code öffnen</h4>
                      <p className="text-sm text-muted-foreground">
                        Webflow Designer → Seiten-Einstellungen (⚙️) → <strong>Custom Code</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium">Script im Head einfügen</h4>
                      <div className="relative">
                        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                          <code>{`<script src="${widgetScriptUrl}" defer></script>`}</code>
                        </pre>
                        <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      3
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium">Embed-Element hinzufügen</h4>
                      <p className="mb-3 text-sm text-muted-foreground">
                        Ziehen Sie ein <strong>Embed</strong> Element auf die Seite und fügen Sie
                        ein:
                      </p>
                      <div className="relative">
                        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                          <code>{`<div 
  data-kundenmagnet-campaign="IHRE-KAMPAGNEN-ID"
  data-theme="light"
  data-limit="6"
  data-layout="grid"
></div>`}</code>
                        </pre>
                        <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wix */}
            <Card id="wix" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>✨</span> Wix
                </CardTitle>
                <CardDescription>Einfach und intuitiv für kleine Unternehmen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium">Embed-Element hinzufügen</h4>
                      <p className="text-sm text-muted-foreground">
                        Klicken Sie auf <strong>+ Hinzufügen → Embed → Embed-Code</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium">Code einfügen</h4>
                      <div className="relative">
                        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                          <code>{`<script src="${widgetScriptUrl}" defer></script>
<div 
  data-kundenmagnet-campaign="IHRE-KAMPAGNEN-ID"
  data-theme="light"
  data-limit="6"
></div>`}</code>
                        </pre>
                        <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Squarespace */}
            <Card id="squarespace" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>🔲</span> Squarespace
                </CardTitle>
                <CardDescription>Premium-Websites mit elegantem Design</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium">Code-Block hinzufügen</h4>
                      <p className="text-sm text-muted-foreground">
                        Klicken Sie auf <strong>Block hinzufügen (+) → Code</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium">HTML-Code einfügen</h4>
                      <div className="relative">
                        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                          <code>{`<script src="${widgetScriptUrl}" defer></script>
<div 
  data-kundenmagnet-campaign="IHRE-KAMPAGNEN-ID"
  data-theme="light"
  data-limit="6"
></div>`}</code>
                        </pre>
                        <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shopware */}
            <Card id="shopware" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>🛒</span> Shopware
                </CardTitle>
                <CardDescription>Deutschlands führende E-Commerce-Plattform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium">Shopping Experiences verwenden</h4>
                      <p className="text-sm text-muted-foreground">
                        Gehen Sie zu <strong>Inhalte → Einkaufserlebnisse</strong> und fügen Sie ein{' '}
                        <strong>HTML-Element</strong> hinzu
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium">Widget-Code einfügen</h4>
                      <div className="relative">
                        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                          <code>{`<script src="${widgetScriptUrl}" defer></script>
<div 
  data-kundenmagnet-campaign="IHRE-KAMPAGNEN-ID"
  data-theme="light"
  data-limit="3"
></div>`}</code>
                        </pre>
                        <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      3
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium">Cache leeren</h4>
                      <p className="text-sm text-muted-foreground">
                        Gehen Sie zu <strong>Einstellungen → System → Caches</strong> und löschen
                        Sie alle Caches
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Jimdo, IONOS, Framer, Carrd - kompakte Versionen */}
            <Card id="jimdo" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>🌐</span> Jimdo
                </CardTitle>
                <CardDescription>Website-Baukasten für Einsteiger</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  Klicken Sie auf <strong>+ Inhalte hinzufügen → Widget / HTML</strong> und fügen
                  Sie den folgenden Code ein:
                </p>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                    <code>{`<script src="${widgetScriptUrl}" defer></script>
<div data-kundenmagnet-campaign="IHRE-KAMPAGNEN-ID" data-theme="light" data-limit="6"></div>`}</code>
                  </pre>
                  <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card id="ionos" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>☁️</span> IONOS (1&1)
                </CardTitle>
                <CardDescription>Website-Baukasten und Hosting</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  Klicken Sie auf{' '}
                  <strong>+ Element hinzufügen → Weitere Elemente → HTML-Code</strong> und fügen Sie
                  ein:
                </p>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                    <code>{`<script src="${widgetScriptUrl}" defer></script>
<div data-kundenmagnet-campaign="IHRE-KAMPAGNEN-ID" data-theme="light" data-limit="6"></div>`}</code>
                  </pre>
                  <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card id="framer" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>⚡</span> Framer
                </CardTitle>
                <CardDescription>Modernes Design-Tool für interaktive Websites</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  Fügen Sie eine <strong>Embed</strong> Komponente hinzu (Taste <kbd>E</kbd>),
                  wählen Sie <strong>HTML</strong> und fügen Sie ein:
                </p>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                    <code>{`<script src="${widgetScriptUrl}" defer></script>
<div data-kundenmagnet-campaign="IHRE-KAMPAGNEN-ID" data-theme="light" data-limit="6" data-layout="grid"></div>`}</code>
                  </pre>
                  <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card id="carrd" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>📄</span> Carrd
                </CardTitle>
                <CardDescription>One-Page-Websites mit minimalem Aufwand</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  Klicken Sie auf <strong>+ Element hinzufügen → Embed</strong>, wählen Sie{' '}
                  <strong>Code</strong> und fügen Sie ein:
                </p>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                    <code>{`<script src="${widgetScriptUrl}" defer></script>
<div data-kundenmagnet-campaign="IHRE-KAMPAGNEN-ID" data-theme="light" data-limit="3"></div>`}</code>
                  </pre>
                  <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900 dark:bg-yellow-950/20">
                  <p className="text-xs font-medium text-yellow-900 dark:text-yellow-100">
                    ⚠️ Hinweis: Embed-Funktion nur in Carrd Pro verfügbar
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Statische HTML-Seiten */}
            <Card id="static" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>💻</span> Statische HTML-Seiten
                </CardTitle>
                <CardDescription>
                  Für selbst gehostete oder handgeschriebene Websites
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium">
                        Script vor <code>&lt;/head&gt;</code> einfügen
                      </h4>
                      <div className="relative">
                        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                          <code>{`<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Meine Website</title>
  
  <!-- Kundenmagnetapp Widget Script -->
  <script src="${widgetScriptUrl}" defer></script>
</head>
<body>
  ...
</body>
</html>`}</code>
                        </pre>
                        <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium">Widget-Container im Body platzieren</h4>
                      <div className="relative">
                        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                          <code>{`<body>
  <h1>Willkommen</h1>
  
  <!-- Bewertungen -->
  <section>
    <h2>Was unsere Kunden sagen</h2>
    <div 
      data-kundenmagnet-campaign="IHRE-KAMPAGNEN-ID"
      data-theme="light"
      data-limit="6"
      data-layout="grid"
    ></div>
  </section>
  
</body>`}</code>
                        </pre>
                        <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Phase 2: JavaScript Frameworks */}
        <div className="mb-12">
          <div className="mb-6 flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Phase 2: JavaScript Frameworks</h2>
          </div>

          <div className="space-y-8">
            {/* React / Next.js */}
            <Card id="react" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>⚛️</span> React / Next.js
                </CardTitle>
                <CardDescription>
                  Für moderne React-Anwendungen (Create React App, Vite, Next.js)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="nextjs" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="nextjs">Next.js</TabsTrigger>
                    <TabsTrigger value="cra">React (CRA)</TabsTrigger>
                    <TabsTrigger value="vite">Vite</TabsTrigger>
                  </TabsList>

                  <TabsContent value="nextjs" className="space-y-4">
                    <div className="space-y-4">
                      <h4 className="font-medium">Next.js App Router (Next.js 13+)</h4>
                      <p className="text-sm text-muted-foreground">
                        <strong>1. Script in layout.tsx laden:</strong>
                      </p>
                      <div className="relative">
                        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                          <code>{`// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        {children}
        <Script 
          src="${widgetScriptUrl}" 
          strategy="lazyOnload" 
        />
      </body>
    </html>
  )
}`}</code>
                        </pre>
                        <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        <strong>2. Widget-Komponente erstellen:</strong>
                      </p>
                      <div className="relative">
                        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                          <code>{`// components/KundenmagnetWidget.tsx
'use client'

interface Props {
  campaignId: string
  theme?: 'light' | 'dark'
  limit?: number
  layout?: 'list' | 'grid' | 'carousel'
}

export function KundenmagnetWidget({
  campaignId,
  theme = 'light',
  limit = 6,
  layout = 'grid'
}: Props) {
  return (
    <div
      data-kundenmagnet-campaign={campaignId}
      data-theme={theme}
      data-limit={limit}
      data-layout={layout}
    />
  )
}`}</code>
                        </pre>
                        <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        <strong>3. Verwenden:</strong>
                      </p>
                      <div className="relative">
                        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                          <code>{`import { KundenmagnetWidget } from '@/components/KundenmagnetWidget'

<KundenmagnetWidget 
  campaignId="ihre-kampagne-id"
  theme="light"
  limit={6}
/>`}</code>
                        </pre>
                        <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="cra" className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>1. Script in public/index.html laden:</strong>
                    </p>
                    <div className="relative">
                      <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                        <code>{`<!-- public/index.html -->
<head>
  <script src="${widgetScriptUrl}" defer></script>
</head>`}</code>
                      </pre>
                      <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      <strong>2. Komponente erstellen und verwenden:</strong>
                    </p>
                    <div className="relative">
                      <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                        <code>{`export function KundenmagnetWidget({ campaignId, theme, limit }) {
  return (
    <div
      data-kundenmagnet-campaign={campaignId}
      data-theme={theme || 'light'}
      data-limit={limit || 6}
    />
  )
}`}</code>
                      </pre>
                      <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="vite" className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Für Vite: Script in <code>index.html</code> laden wie bei Create React App,
                      dann die gleiche Komponente verwenden.
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Vue / Nuxt */}
            <Card id="vue" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>🖖</span> Vue.js / Nuxt
                </CardTitle>
                <CardDescription>Für Vue 3 und Nuxt 3 Anwendungen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  <strong>Nuxt 3: Script in nuxt.config.ts registrieren:</strong>
                </p>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                    <code>{`// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      script: [
        { src: '${widgetScriptUrl}', defer: true }
      ]
    }
  }
})`}</code>
                  </pre>
                  <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                  <strong>Widget-Komponente:</strong>
                </p>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                    <code>{`<!-- components/KundenmagnetWidget.vue -->
<template>
  <div
    :data-kundenmagnet-campaign="campaignId"
    :data-theme="theme"
    :data-limit="limit"
  ></div>
</template>

<script setup>
const props = defineProps({
  campaignId: String,
  theme: { type: String, default: 'light' },
  limit: { type: Number, default: 6 }
})
</script>`}</code>
                  </pre>
                  <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Angular */}
            <Card id="angular" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>🅰️</span> Angular
                </CardTitle>
                <CardDescription>Für Angular 15+ Anwendungen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  <strong>1. Script in angular.json registrieren:</strong>
                </p>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                    <code>{`// angular.json
"scripts": [
  "${widgetScriptUrl}"
]`}</code>
                  </pre>
                  <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                  <strong>2. Komponente erstellen:</strong>
                </p>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                    <code>{`import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-kundenmagnet-widget',
  template: \`
    <div
      [attr.data-kundenmagnet-campaign]="campaignId"
      [attr.data-theme]="theme"
      [attr.data-limit]="limit"
    ></div>
  \`
})
export class KundenmagnetWidgetComponent {
  @Input() campaignId!: string
  @Input() theme: string = 'light'
  @Input() limit: number = 6
}`}</code>
                  </pre>
                  <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Svelte */}
            <Card id="svelte" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>🔥</span> Svelte / SvelteKit
                </CardTitle>
                <CardDescription>Für Svelte 4+ und SvelteKit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  <strong>SvelteKit: Script in app.html laden:</strong>
                </p>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                    <code>{`<!-- src/app.html -->
<head>
  <script src="${widgetScriptUrl}" defer></script>
  %sveltekit.head%
</head>`}</code>
                  </pre>
                  <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                  <strong>Widget-Komponente:</strong>
                </p>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                    <code>{`<!-- KundenmagnetWidget.svelte -->
<script>
  export let campaignId
  export let theme = 'light'
  export let limit = 6
</script>

<div
  data-kundenmagnet-campaign={campaignId}
  data-theme={theme}
  data-limit={limit}
></div>`}</code>
                  </pre>
                  <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Phase 3: Erweitert */}
        <div className="mb-12">
          <div className="mb-6 flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Phase 3: Erweiterte Integration</h2>
          </div>

          <div className="space-y-8">
            {/* Google Tag Manager */}
            <Card id="gtm" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>📊</span> Google Tag Manager (GTM)
                </CardTitle>
                <CardDescription>
                  Zentrale Verwaltung aller Marketing-Tags und Scripts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium">Neuen Tag erstellen</h4>
                      <p className="text-sm text-muted-foreground">
                        GTM Dashboard → <strong>Tags → Neu</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium">Tag-Konfiguration</h4>
                      <ul className="mb-3 space-y-1 text-sm text-muted-foreground">
                        <li>
                          • Tag-Typ: <strong>Benutzerdefiniertes HTML</strong>
                        </li>
                        <li>• Name: &quot;Kundenmagnetapp Widget&quot;</li>
                      </ul>
                      <div className="relative">
                        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                          <code>{`<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${widgetScriptUrl}';
    script.defer = true;
    document.head.appendChild(script);
  })();
</script>

<div 
  data-kundenmagnet-campaign="IHRE-KAMPAGNEN-ID"
  data-theme="light"
  data-limit="6"
></div>`}</code>
                        </pre>
                        <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      3
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium">Trigger festlegen</h4>
                      <p className="text-sm text-muted-foreground">
                        Trigger-Typ: <strong>Seitenaufruf</strong> (z.B. nur auf Bewertungsseiten)
                        oder <strong>Alle Seiten</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      4
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium">Veröffentlichen</h4>
                      <p className="text-sm text-muted-foreground">
                        Klicken Sie auf <strong>Senden</strong> und veröffentlichen Sie den
                        Container.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/20">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    💡 Profi-Tipp: DataLayer-Variablen
                  </p>
                  <p className="mt-1 text-xs text-blue-800 dark:text-blue-200">
                    Sie können die Kampagnen-ID dynamisch aus dem GTM Datalay er übergeben:
                    Erstellen Sie eine Variable und nutzen Sie <code>{'{{dlv - campaignId}}'}</code>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* CSP & CORS */}
            <Card id="csp" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>🔒</span> CSP & CORS Konfiguration
                </CardTitle>
                <CardDescription>
                  Content Security Policy und Cross-Origin Resource Sharing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-medium">Content Security Policy (CSP)</h4>
                    <p className="mb-3 text-sm text-muted-foreground">
                      Falls Ihre Website eine strikte CSP verwendet, fügen Sie folgende Domains zur
                      Whitelist hinzu:
                    </p>
                    <div className="relative">
                      <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                        <code>{`Content-Security-Policy:
  script-src 'self' https://${BRAND.domain};
  connect-src 'self' https://${BRAND.domain};
  img-src 'self' https://${BRAND.domain} data:;`}</code>
                      </pre>
                      <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 font-medium">CORS Headers</h4>
                    <p className="mb-3 text-sm text-muted-foreground">
                      Das Widget nutzt CORS-kompatible Requests. Keine zusätzliche Konfiguration
                      erforderlich. Falls Sie einen Reverse Proxy verwenden, stellen Sie sicher,
                      dass CORS-Header durchgereicht werden.
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-2 font-medium">iFrame-Sandbox (falls verwendet)</h4>
                    <p className="mb-3 text-sm text-muted-foreground">
                      Wenn Sie das iFrame-Fallback verwenden, erlauben Sie:
                    </p>
                    <div className="relative">
                      <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                        <code>{`<iframe
  src="https://${BRAND.domain}/widget/frame?campaign=IHRE-ID"
  sandbox="allow-scripts allow-same-origin"
  style="border:none; width:100%; height:600px;"
></iframe>`}</code>
                      </pre>
                      <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Caching & Performance */}
            <Card id="caching" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>⚡</span> Caching & Performance
                </CardTitle>
                <CardDescription>
                  Optimieren Sie die Ladezeit und das Caching-Verhalten
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-medium">Widget-Script Caching</h4>
                    <p className="text-sm text-muted-foreground">
                      Das Widget-Script wird mit einem Cache-Header von <strong>1 Jahr</strong>{' '}
                      ausgeliefert. Nutzen Sie die versionierte URL für kontrollierbares Caching:
                    </p>
                    <div className="relative mt-3">
                      <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                        <code>{`<script src="${widgetScriptUrl}?v=20250103" defer></script>`}</code>
                      </pre>
                      <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 font-medium">Lazy Loading</h4>
                    <p className="text-sm text-muted-foreground">
                      Das Widget lädt Bewertungen erst, wenn es im Viewport sichtbar wird
                      (Intersection Observer). Keine zusätzliche Konfiguration erforderlich.
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-2 font-medium">CDN & Edge Caching</h4>
                    <p className="text-sm text-muted-foreground">
                      Das Widget wird über ein globales CDN ausgeliefert. Die nächste Edge-Location
                      wird automatisch gewählt. Bewertungen werden für <strong>5 Minuten</strong>{' '}
                      gecacht.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border p-4 text-center">
                      <div className="text-2xl font-bold text-primary">&lt; 20KB</div>
                      <div className="text-sm text-muted-foreground">Script-Größe (gzip)</div>
                    </div>
                    <div className="rounded-lg border p-4 text-center">
                      <div className="text-2xl font-bold text-primary">&lt; 100ms</div>
                      <div className="text-sm text-muted-foreground">Durchschn. Ladezeit</div>
                    </div>
                    <div className="rounded-lg border p-4 text-center">
                      <div className="text-2xl font-bold text-primary">A+</div>
                      <div className="text-sm text-muted-foreground">PageSpeed Score</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Widget-Attribute */}
            <Card id="attributes" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>⚙️</span> Widget-Attribute Referenz
                </CardTitle>
                <CardDescription>
                  Alle verfügbaren Data-Attribute zur Anpassung des Widgets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left font-medium">Attribut</th>
                        <th className="p-2 text-left font-medium">Werte</th>
                        <th className="p-2 text-left font-medium">Standard</th>
                        <th className="p-2 text-left font-medium">Beschreibung</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      <tr className="border-b">
                        <td className="p-2">
                          <code>data-kundenmagnet-campaign</code>
                        </td>
                        <td className="p-2">String</td>
                        <td className="p-2">
                          <em>Erforderlich</em>
                        </td>
                        <td className="p-2">Ihre Kampagnen-ID</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">
                          <code>data-theme</code>
                        </td>
                        <td className="p-2">light | dark</td>
                        <td className="p-2">light</td>
                        <td className="p-2">Farbschema des Widgets</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">
                          <code>data-limit</code>
                        </td>
                        <td className="p-2">1-20</td>
                        <td className="p-2">6</td>
                        <td className="p-2">Anzahl der angezeigten Bewertungen</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">
                          <code>data-layout</code>
                        </td>
                        <td className="p-2">list | grid | carousel</td>
                        <td className="p-2">grid</td>
                        <td className="p-2">Layout-Darstellung</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">
                          <code>data-sort</code>
                        </td>
                        <td className="p-2">recent | rating</td>
                        <td className="p-2">recent</td>
                        <td className="p-2">Sortierung der Bewertungen</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">
                          <code>data-show-date</code>
                        </td>
                        <td className="p-2">true | false</td>
                        <td className="p-2">true</td>
                        <td className="p-2">Datum anzeigen</td>
                      </tr>
                      <tr>
                        <td className="p-2">
                          <code>data-show-author</code>
                        </td>
                        <td className="p-2">true | false</td>
                        <td className="p-2">true</td>
                        <td className="p-2">Autor-Name anzeigen</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4">
                  <h4 className="mb-2 text-sm font-medium">Beispiel mit allen Optionen:</h4>
                  <div className="relative">
                    <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                      <code>{`<div 
  data-kundenmagnet-campaign="ihre-kampagne-id"
  data-theme="dark"
  data-limit="12"
  data-layout="carousel"
  data-sort="rating"
  data-show-date="true"
  data-show-author="true"
></div>`}</code>
                    </pre>
                    <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Support & Hilfe */}
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Hilfe benötigt?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-blue-900 dark:text-blue-100">
              Falls Sie Probleme bei der Installation haben oder Ihre Plattform hier nicht
              aufgeführt ist, kontaktieren Sie uns gerne:
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="outline" asChild>
                <a href={`mailto:${BRAND.email.support}`}>
                  E-Mail Support
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs/widget">
                  Widget-Dokumentation
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
