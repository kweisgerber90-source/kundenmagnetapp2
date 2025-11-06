// app/docs/install/platforms/page.tsx
// Aktualisiert für Widget v2.0 mit iFrame-Fokus und automatischem Fallback
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, Code, Copy, Globe, Plug } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Plattform-spezifische Installation | Kundenmagnetapp Dokumentation',
  description:
    'Detaillierte Schritt-für-Schritt Anleitungen zur Widget-Installation für WordPress, Shopify, Webflow, Wix und weitere Plattformen',
}

export default function PlatformInstallDocsPage() {
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

        {/* Wichtiger Hinweis zum Kampagnen-Slug */}
        <Alert className="mb-8 border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            <strong>Wichtig:</strong> In allen Code-Beispielen müssen Sie{' '}
            <code className="font-bold">ihr-slug</code> oder{' '}
            <code className="font-bold">IHRE-KAMPAGNEN-ID</code> durch Ihren eigenen Kampagnen-Slug
            ersetzen.
            <br />
            <strong>Wo finden Sie Ihren Slug?</strong> Dashboard → Kampagnen → Blaue Box
            &quot;Widget-Slug&quot; → Kopieren
          </AlertDescription>
        </Alert>

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
                { name: 'Vue/Nuxt', href: '#vue', icon: '💚' },
                { name: 'Angular', href: '#angular', icon: '🅰️' },
                { name: 'Svelte/SvelteKit', href: '#svelte', icon: '🔥' },
                { name: 'Google Tag Manager', href: '#gtm', icon: '📊' },
                { name: 'Content Security Policy', href: '#csp', icon: '🔒' },
                { name: 'Caching & CDN', href: '#caching', icon: '⚡' },
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
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>📝</span> WordPress
                </CardTitle>
                <CardDescription>
                  Die weltweit beliebteste CMS-Plattform (Gutenberg, Elementor, Classic Editor)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    <strong>Empfohlen für WordPress:</strong> Verwenden Sie die iFrame-Variante für
                    maximale Kompatibilität mit Security-Plugins (Wordfence, iThemes Security) und
                    Cache-Systemen (WP Rocket, W3 Total Cache).
                  </AlertDescription>
                </Alert>

                <Tabs defaultValue="manual" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="manual">Manuelle Installation (Empfohlen)</TabsTrigger>
                    <TabsTrigger value="shortcode">Shortcode (für Entwickler)</TabsTrigger>
                  </TabsList>

                  <TabsContent value="manual" className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                          1
                        </div>
                        <div className="flex-1">
                          <h4 className="mb-2 font-medium">
                            Kampagnen-Slug aus Dashboard kopieren
                          </h4>
                          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                            <p className="text-sm text-blue-900">
                              <strong>
                                Dashboard → Kampagnen → Blaue Box &quot;Widget-Slug&quot;
                              </strong>
                              <br />
                              Beispiel: Wenn Ihr Slug <code>mein-shop</code> ist, verwenden Sie
                              diesen in Schritt 2.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                          2
                        </div>
                        <div className="flex-1">
                          <h4 className="mb-2 font-medium">
                            Gutenberg Block Editor: HTML-Block hinzufügen
                          </h4>
                          <p className="mb-3 text-sm text-muted-foreground">
                            Öffnen Sie die Seite/Beitrag → Klicken Sie <strong>+</strong> → Suchen
                            Sie <strong>&quot;Benutzerdefiniertes HTML&quot;</strong>
                          </p>
                          <div className="relative">
                            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                              <code>{`<!-- Kundenmagnet Widget (iFrame-Variante) -->
<iframe
  src="https://kundenmagnet-app.de/widget/frame?campaign=ihr-slug&limit=10"
  style="width: 100%; border: none; min-height: 400px;"
  title="Kundenbewertungen"
></iframe>

<!-- WICHTIG: Ersetzen Sie "ihr-slug" mit Ihrem Kampagnen-Slug aus Schritt 1! -->
<!-- Beispiel: campaign=mein-shop -->`}</code>
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
                            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                              <p className="font-medium text-yellow-900">
                                ⚠️ Widget wird nicht angezeigt
                              </p>
                              <ul className="mt-2 space-y-1 text-xs text-yellow-800">
                                <li>
                                  • <strong>Slug falsch?</strong> Prüfen Sie, dass Sie{' '}
                                  <code>ihr-slug</code> ersetzt haben
                                </li>
                                <li>
                                  • <strong>Caching-Plugins</strong> (z.B. WP Rocket): Cache leeren
                                </li>
                                <li>
                                  • <strong>Security-Plugins</strong> (z.B. Wordfence): Domain{' '}
                                  <code>kundenmagnet-app.de</code> zur Whitelist hinzufügen
                                </li>
                                <li>
                                  • <strong>Browser-Cache:</strong> Strg+Shift+R (Windows) /
                                  Cmd+Shift+R (Mac)
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Alert className="border-green-200 bg-green-50">
                        <AlertCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-900">
                          <strong>Warum iFrame für WordPress?</strong>
                          <ul className="mt-2 space-y-1 text-sm">
                            <li>✓ Funktioniert mit allen Security-Plugins</li>
                            <li>✓ Keine CORS/CSP-Probleme</li>
                            <li>✓ Kein Cookie-Banner erforderlich</li>
                            <li>✓ 100% garantierte Funktionalität</li>
                          </ul>
                        </AlertDescription>
                      </Alert>
                    </div>
                  </TabsContent>

                  <TabsContent value="shortcode" className="space-y-4">
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-900">
                        <strong>Für Entwickler:</strong> Diese Methode erfordert Zugriff auf die{' '}
                        <code>functions.php</code> Ihres Child-Themes.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Fügen Sie diesen Code in die <code>functions.php</code> Ihres Child-Themes
                        ein:
                      </p>

                      <div className="relative">
                        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                          <code>{`// Kundenmagnet Widget Shortcode
function kundenmagnet_widget_shortcode($atts) {
    $atts = shortcode_atts(array(
        'campaign' => 'default', // Ersetzen Sie 'default' mit Ihrem Standard-Slug
        'limit' => '10',
        'theme' => 'light'
    ), $atts);
    
    return sprintf(
        '<iframe src="https://kundenmagnet-app.de/widget/frame?campaign=%s&limit=%s&theme=%s" 
                 style="width: 100%%; border: none; min-height: 400px;" 
                 title="Kundenbewertungen"></iframe>',
        esc_attr($atts['campaign']),
        esc_attr($atts['limit']),
        esc_attr($atts['theme'])
    );
}
add_shortcode('kundenmagnet', 'kundenmagnet_widget_shortcode');

/* Verwendung im Editor:
   [kundenmagnet campaign="ihr-slug" limit="5"]
   
   WICHTIG: Ersetzen Sie "ihr-slug" mit Ihrem Kampagnen-Slug!
   Wo finden? Dashboard → Kampagnen → Widget-Slug kopieren
*/`}</code>
                        </pre>
                        <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                        <h4 className="mb-2 text-sm font-medium text-blue-900">
                          Verwendung im Editor:
                        </h4>
                        <code className="text-sm text-blue-800">
                          [kundenmagnet campaign=&quot;mein-shop&quot; limit=&quot;5&quot;]
                        </code>
                        <p className="mt-2 text-xs text-blue-700">
                          Ersetzen Sie <strong>mein-shop</strong> mit Ihrem tatsächlichen
                          Kampagnen-Slug aus dem Dashboard!
                        </p>
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
                  E-Commerce-Plattform mit Theme-Integration und Custom Sections
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    <strong>Slug-Hinweis:</strong> In allen Shopify-Code-Beispielen müssen Sie{' '}
                    <code>ihr-slug</code> durch Ihren Kampagnen-Slug aus dem Dashboard ersetzen!
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Kampagnen-Slug kopieren</h4>
                      <p className="text-sm text-muted-foreground">
                        Dashboard → Kampagnen → Blaue Box &quot;Widget-Slug&quot; → Kopieren
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Theme-Editor öffnen</h4>
                      <p className="text-sm text-muted-foreground">
                        <strong>Online Store → Themes → Customize</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      3
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium">Custom Liquid Section hinzufügen</h4>
                      <p className="mb-3 text-sm text-muted-foreground">
                        Klicken Sie <strong>&quot;Add section&quot;</strong> →{' '}
                        <strong>&quot;Custom Liquid&quot;</strong>
                      </p>
                      <div className="relative">
                        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                          <code>{`<!-- Shopify Custom Liquid Section -->
<div class="kundenmagnet-section page-width">
  <h2>{{ section.settings.heading }}</h2>
  
  <!-- Widget iFrame -->
  <iframe
    src="https://kundenmagnet-app.de/widget/frame?campaign=ihr-slug&limit=10&theme=light"
    style="width: 100%; border: none; min-height: 500px;"
    title="Kundenbewertungen"
    loading="lazy"
  ></iframe>
</div>

<style>
.kundenmagnet-section {
  margin: 60px auto;
  padding: 0 20px;
}
.kundenmagnet-section h2 {
  text-align: center;
  margin-bottom: 2rem;
}
</style>

<!-- WICHTIG: Ersetzen Sie "ihr-slug" mit Ihrem Kampagnen-Slug! -->
<!-- Wo finden? Dashboard → Kampagnen → Widget-Slug kopieren -->`}</code>
                        </pre>
                        <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-900">
                      <strong>Beispiel:</strong> Wenn Ihr Kampagnen-Slug{' '}
                      <code>online-shop-2024</code> ist, ändern Sie die Zeile zu:
                      <br />
                      <code className="mt-2 block text-xs">
                        campaign=online-shop-2024&amp;limit=10
                      </code>
                    </AlertDescription>
                  </Alert>
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
                  Professioneller Website-Builder mit Custom Code Support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    <strong>Slug-Hinweis:</strong> Ersetzen Sie in allen Code-Beispielen{' '}
                    <code>ihr-slug</code> mit Ihrem Kampagnen-Slug aus dem Dashboard (Kampagnen →
                    Widget-Slug).
                  </AlertDescription>
                </Alert>

                <Tabs defaultValue="embed" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="embed">Embed Element (Einfach)</TabsTrigger>
                    <TabsTrigger value="custom">Custom Code (Performant)</TabsTrigger>
                  </TabsList>

                  <TabsContent value="embed" className="space-y-4">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        <strong>Schritt 1:</strong> Öffnen Sie Ihre Seite im Webflow Designer
                        <br />
                        <strong>Schritt 2:</strong> Fügen Sie ein <strong>&quot;Embed&quot;</strong>{' '}
                        Element hinzu
                        <br />
                        <strong>Schritt 3:</strong> Fügen Sie folgenden Code ein:
                      </p>

                      <div className="relative">
                        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                          <code>{`<!-- iFrame-Variante (funktioniert immer) -->
<iframe
  src="https://kundenmagnet-app.de/widget/frame?campaign=ihr-slug&limit=10"
  style="width: 100%; border: none; min-height: 400px;"
  title="Kundenbewertungen"
></iframe>

<!-- WICHTIG: "ihr-slug" ersetzen! -->
<!-- Dashboard → Kampagnen → Widget-Slug kopieren -->`}</code>
                        </pre>
                        <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="custom" className="space-y-4">
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-900">
                        <strong>Für bessere Performance:</strong> Laden Sie das Widget-Script global
                        im Custom Code.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        <strong>Schritt 1:</strong> Page Settings → Custom Code → Before{' '}
                        <code>&lt;/body&gt;</code> tag:
                      </p>

                      <div className="relative">
                        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                          <code>{`<script src="https://kundenmagnet-app.de/widget.js" async></script>`}</code>
                        </pre>
                        <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        <strong>Schritt 2:</strong> Auf der Seite ein Embed-Element mit:
                      </p>

                      <div className="relative">
                        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                          <code>{`<div 
  data-kundenmagnet-widget
  data-campaign="ihr-slug"
  data-limit="10"
  data-theme="light"
></div>

<!-- WICHTIG: "ihr-slug" durch Ihren Kampagnen-Slug ersetzen! -->
<!-- Wo finden? Dashboard → Kampagnen → Widget-Slug -->`}</code>
                        </pre>
                        <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Wix */}
            <Card id="wix" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>✨</span> Wix
                </CardTitle>
                <CardDescription>Website-Baukasten mit Drag & Drop Editor</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    <strong>Wichtig:</strong> Vergessen Sie nicht, <code>ihr-slug</code> durch Ihren
                    Kampagnen-Slug zu ersetzen! (Dashboard → Kampagnen → Widget-Slug)
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  {[
                    { step: 1, title: 'Seite im Wix-Editor öffnen' },
                    { step: 2, title: 'Klicken Sie auf "+" → "Embed" → "Embed Code"' },
                    { step: 3, title: 'Wählen Sie "Code" (nicht "Website")' },
                    {
                      step: 4,
                      title: 'Fügen Sie den iFrame-Code ein (siehe unten)',
                      content: true,
                    },
                    { step: 5, title: 'Größe anpassen und "Veröffentlichen" klicken' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        {item.content && (
                          <div className="relative mt-2">
                            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                              <code>{`<!-- Wix Embed Code -->
<iframe
  src="https://kundenmagnet-app.de/widget/frame?campaign=ihr-slug&limit=8"
  style="width: 100%; border: none; min-height: 450px;"
  title="Kundenbewertungen"
></iframe>

<!-- WICHTIG: "ihr-slug" ersetzen mit Ihrem Kampagnen-Slug! -->
<!-- Beispiel: campaign=wix-shop-bewertungen -->`}</code>
                            </pre>
                            <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Squarespace */}
            <Card id="squarespace" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>🔲</span> Squarespace
                </CardTitle>
                <CardDescription>Premium Website-Builder</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    <strong>Slug-Hinweis:</strong> In Schritt 3 müssen Sie <code>ihr-slug</code> mit
                    Ihrem Kampagnen-Slug aus dem Dashboard ersetzen!
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  {[
                    { step: 1, title: 'Seite bearbeiten im Squarespace-Editor' },
                    { step: 2, title: 'Klicken Sie auf "+" → "Code"' },
                    { step: 3, title: 'Fügen Sie den iFrame-Code ein:', content: true },
                    { step: 4, title: 'Speichern und Veröffentlichen' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        {item.content && (
                          <div className="relative mt-2">
                            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                              <code>{`<iframe
  src="https://kundenmagnet-app.de/widget/frame?campaign=ihr-slug&limit=10"
  style="width: 100%; border: none; min-height: 400px;"
  title="Kundenbewertungen"
></iframe>

<!-- WICHTIG: "ihr-slug" durch Ihren Kampagnen-Slug ersetzen! -->
<!-- Dashboard → Kampagnen → Widget-Slug kopieren -->`}</code>
                            </pre>
                            <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shopware */}
            <Card id="shopware" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>🛒</span> Shopware
                </CardTitle>
                <CardDescription>
                  Deutsche E-Commerce-Plattform mit Shopping Experiences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    <strong>Slug-Hinweis:</strong> Ersetzen Sie in allen Code-Beispielen{' '}
                    <code>ihr-slug</code> mit Ihrem Kampagnen-Slug aus Dashboard → Kampagnen →
                    Widget-Slug.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  {[
                    { step: 1, title: 'Shopping Experiences → Neue Experience erstellen' },
                    { step: 2, title: 'Layout auswählen → "HTML-Element" hinzufügen' },
                    { step: 3, title: 'iFrame-Code einfügen:', content: true },
                    { step: 4, title: 'Speichern und Seite zuweisen' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        {item.content && (
                          <div className="relative mt-2">
                            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                              <code>{`<!-- Shopware HTML-Element -->
<div class="kundenmagnet-widget-container">
  <h2>Kundenbewertungen</h2>
  <iframe
    src="https://kundenmagnet-app.de/widget/frame?campaign=ihr-slug&limit=10"
    style="width: 100%; border: none; min-height: 400px;"
    title="Kundenbewertungen"
  ></iframe>
</div>

<!-- WICHTIG: "ihr-slug" durch Ihren Kampagnen-Slug ersetzen! -->
<!-- Beispiel: campaign=shopware-store -->`}</code>
                            </pre>
                            <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Jimdo */}
            <Card id="jimdo" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>🌐</span> Jimdo
                </CardTitle>
                <CardDescription>Website-Baukasten Made in Germany</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    <strong>Slug-Hinweis:</strong> Vergessen Sie nicht, <code>ihr-slug</code> mit
                    Ihrem Kampagnen-Slug zu ersetzen (Dashboard → Kampagnen → Widget-Slug).
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  {[
                    { step: 1, title: 'Seite bearbeiten in Jimdo' },
                    { step: 2, title: 'Element hinzufügen → "Widget/HTML"' },
                    { step: 3, title: 'iFrame-Code einfügen:', content: true },
                    { step: 4, title: 'Speichern' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        {item.content && (
                          <div className="relative mt-2">
                            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                              <code>{`<iframe
  src="https://kundenmagnet-app.de/widget/frame?campaign=ihr-slug&limit=10"
  style="width: 100%; border: none; min-height: 400px;"
  title="Kundenbewertungen"
></iframe>

<!-- WICHTIG: "ihr-slug" ersetzen! -->
<!-- Dashboard → Kampagnen → Widget-Slug -->`}</code>
                            </pre>
                            <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* IONOS */}
            <Card id="ionos" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>☁️</span> IONOS (1&1)
                </CardTitle>
                <CardDescription>MyWebsite & Hosted Websites</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    <strong>Slug-Hinweis:</strong> Ersetzen Sie <code>ihr-slug</code> mit Ihrem
                    Kampagnen-Slug aus dem Dashboard (Kampagnen → Widget-Slug).
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  {[
                    { step: 1, title: 'IONOS Website bearbeiten' },
                    { step: 2, title: 'Element hinzufügen → "HTML"' },
                    { step: 3, title: 'iFrame-Code einfügen:', content: true },
                    { step: 4, title: 'Veröffentlichen' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        {item.content && (
                          <div className="relative mt-2">
                            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                              <code>{`<iframe
  src="https://kundenmagnet-app.de/widget/frame?campaign=ihr-slug&limit=10"
  style="width: 100%; border: none; min-height: 400px;"
  title="Kundenbewertungen"
></iframe>

<!-- WICHTIG: "ihr-slug" durch Ihren Kampagnen-Slug ersetzen! -->`}</code>
                            </pre>
                            <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Framer */}
            <Card id="framer" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>⚡</span> Framer
                </CardTitle>
                <CardDescription>Design-to-Code Website-Builder</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    <strong>Slug-Hinweis:</strong> In allen Code-Beispielen <code>ihr-slug</code>{' '}
                    mit Ihrem Kampagnen-Slug ersetzen (Dashboard → Kampagnen → Widget-Slug).
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  {[
                    { step: 1, title: 'Framer-Projekt öffnen' },
                    { step: 2, title: 'Insert → Embed' },
                    { step: 3, title: 'iFrame-Code einfügen:', content: true },
                    { step: 4, title: 'Größe anpassen und Veröffentlichen' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        {item.content && (
                          <div className="relative mt-2">
                            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                              <code>{`<iframe
  src="https://kundenmagnet-app.de/widget/frame?campaign=ihr-slug&limit=10"
  style="width: 100%; border: none; min-height: 400px;"
  title="Kundenbewertungen"
></iframe>

<!-- WICHTIG: "ihr-slug" ersetzen! -->`}</code>
                            </pre>
                            <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Carrd */}
            <Card id="carrd" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>📄</span> Carrd
                </CardTitle>
                <CardDescription>Simple One-Page Website Builder</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    <strong>Slug-Hinweis:</strong> Ersetzen Sie <code>ihr-slug</code> mit Ihrem
                    Kampagnen-Slug (Dashboard → Kampagnen → Widget-Slug).
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  {[
                    { step: 1, title: 'Carrd-Seite bearbeiten' },
                    { step: 2, title: 'Container hinzufügen → "Embed"' },
                    { step: 3, title: 'Code Style: "Inline" auswählen' },
                    { step: 4, title: 'iFrame-Code einfügen:', content: true },
                    { step: 5, title: 'Veröffentlichen (Pro-Feature erforderlich)' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        {item.content && (
                          <div className="relative mt-2">
                            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                              <code>{`<iframe
  src="https://kundenmagnet-app.de/widget/frame?campaign=ihr-slug&limit=6"
  style="width: 100%; border: none; min-height: 350px;"
  title="Kundenbewertungen"
></iframe>

<!-- WICHTIG: "ihr-slug" ersetzen! -->`}</code>
                            </pre>
                            <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-900">
                    <strong>Hinweis:</strong> Embed-Code ist ein Pro-Feature bei Carrd (ab $9/Jahr)
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Statisches HTML */}
            <Card id="static" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>💻</span> Statisches HTML
                </CardTitle>
                <CardDescription>Für reine HTML/CSS/JavaScript-Websites ohne CMS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    <strong>Slug-Hinweis:</strong> Im Code-Beispiel unten müssen Sie{' '}
                    <code>ihr-slug</code> mit Ihrem Kampagnen-Slug ersetzen (Dashboard → Kampagnen →
                    Widget-Slug).
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Komplettes HTML-Beispiel mit Widget-Integration:
                  </p>

                  <div className="relative">
                    <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                      <code>{`<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meine Website - Kundenbewertungen</title>
    <style>
        .testimonials {
            max-width: 1200px;
            margin: 60px auto;
            padding: 0 20px;
        }
        .testimonials h2 {
            text-align: center;
            margin-bottom: 2rem;
        }
    </style>
</head>
<body>
    <header>
        <h1>Meine Website</h1>
    </header>
    
    <main>
        <section class="testimonials">
            <h2>Das sagen unsere Kunden</h2>
            
            <!-- iFrame-Variante (Empfohlen) -->
            <iframe
                src="https://kundenmagnet-app.de/widget/frame?campaign=ihr-slug&limit=10"
                style="width: 100%; border: none; min-height: 400px;"
                title="Kundenbewertungen"
            ></iframe>
            
            <!-- ODER JavaScript-Variante (mit automatischem Fallback): -->
            <!--
            <div 
                data-kundenmagnet-widget
                data-campaign="ihr-slug"
                data-limit="10"
                data-theme="light"
            ></div>
            <script src="https://kundenmagnet-app.de/widget.js" async></script>
            -->
        </section>
    </main>
    
    <footer>
        <p>&copy; 2025 Meine Website</p>
    </footer>
</body>
</html>

<!-- WICHTIG: "ihr-slug" durch Ihren Kampagnen-Slug ersetzen! -->
<!-- Dashboard → Kampagnen → Widget-Slug kopieren -->
<!-- Beispiel: campaign=meine-webseite -->`}</code>
                    </pre>
                    <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <h4 className="mb-2 font-semibold text-blue-900">iFrame-Variante</h4>
                      <ul className="space-y-1 text-sm text-blue-800">
                        <li>✓ Funktioniert garantiert überall</li>
                        <li>✓ Kein JavaScript nötig</li>
                        <li>✓ Einfachste Integration</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                      <h4 className="mb-2 font-semibold text-purple-900">JavaScript-Variante</h4>
                      <ul className="space-y-1 text-sm text-purple-800">
                        <li>✓ Bessere Performance</li>
                        <li>✓ Shadow DOM (isoliert)</li>
                        <li>✓ Auto-Fallback zu iFrame</li>
                      </ul>
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
            {/* React/Next.js */}
            <Card id="react" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>⚛️</span> React / Next.js
                </CardTitle>
                <CardDescription>
                  Moderne React-Anwendungen (Create React App, Vite, Next.js App Router)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    <strong>Slug-Hinweis:</strong> In allen React-Komponenten müssen Sie den{' '}
                    <code>campaign</code>-Prop mit Ihrem Kampagnen-Slug aus dem Dashboard füllen!
                  </AlertDescription>
                </Alert>

                <Tabs defaultValue="nextjs" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="nextjs">Next.js (App Router)</TabsTrigger>
                    <TabsTrigger value="react">React (CRA/Vite)</TabsTrigger>
                  </TabsList>

                  <TabsContent value="nextjs" className="space-y-4">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        <strong>Schritt 1:</strong> Erstellen Sie eine wiederverwendbare Komponente:
                      </p>

                      <div className="relative">
                        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                          <code>{`// app/components/KundenmagnetWidget.tsx
'use client'

import Script from 'next/script'

interface Props {
  campaign: string  // Kampagnen-Slug aus Dashboard!
  limit?: number
  theme?: 'light' | 'dark' | 'auto'
}

export function KundenmagnetWidget({ 
  campaign,  // WICHTIG: Hier Ihren Slug übergeben!
  limit = 10, 
  theme = 'light' 
}: Props) {
  return (
    <>
      <div
        data-kundenmagnet-widget
        data-campaign={campaign}
        data-limit={limit}
        data-theme={theme}
      />
      <Script 
        src="https://kundenmagnet-app.de/widget.js" 
        strategy="lazyOnload"
      />
    </>
  )
}

/* Verwendung in Ihrer page.tsx:
   
   import { KundenmagnetWidget } from '@/components/KundenmagnetWidget'
   
   <KundenmagnetWidget campaign="ihr-slug" limit={8} />
   
   WICHTIG: "ihr-slug" ersetzen!
   Dashboard → Kampagnen → Widget-Slug kopieren
   Beispiel: campaign="mein-nextjs-shop"
*/`}</code>
                        </pre>
                        <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                        <h4 className="mb-2 text-sm font-semibold text-orange-900">
                          Verwendungsbeispiel:
                        </h4>
                        <pre className="overflow-x-auto rounded bg-white p-3 text-xs">
                          <code>{`// app/page.tsx
import { KundenmagnetWidget } from '@/components/KundenmagnetWidget'

export default function HomePage() {
  return (
    <main>
      <h1>Willkommen</h1>
      
      <section className="testimonials">
        <h2>Kundenbewertungen</h2>
        {/* Ihren Kampagnen-Slug hier einfügen! */}
        <KundenmagnetWidget campaign="mein-shop" limit={8} theme="light" />
      </section>
    </main>
  )
}`}</code>
                        </pre>
                        <p className="mt-2 text-xs text-orange-700">
                          <strong>Denken Sie daran:</strong> <code>&quot;mein-shop&quot;</code> mit
                          Ihrem tatsächlichen Kampagnen-Slug ersetzen!
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="react" className="space-y-4">
                    <div className="space-y-4">
                      <div className="relative">
                        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                          <code>{`// components/KundenmagnetWidget.tsx
import { useEffect } from 'react'

interface Props {
  campaign: string  // Kampagnen-Slug aus Dashboard!
  limit?: number
  theme?: 'light' | 'dark' | 'auto'
}

export function KundenmagnetWidget({ 
  campaign,  // WICHTIG: Hier Ihren Slug übergeben!
  limit = 10, 
  theme = 'light' 
}: Props) {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://kundenmagnet-app.de/widget.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div
      data-kundenmagnet-widget
      data-campaign={campaign}
      data-limit={limit}
      data-theme={theme}
    />
  )
}

/* Verwendung:
   
   <KundenmagnetWidget campaign="ihr-slug" limit={8} />
   
   WICHTIG: "ihr-slug" durch Ihren Kampagnen-Slug ersetzen!
   Dashboard → Kampagnen → Widget-Slug kopieren
*/`}</code>
                        </pre>
                        <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Vue/Nuxt */}
            <Card id="vue" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>💚</span> Vue / Nuxt
                </CardTitle>
                <CardDescription>Progressive JavaScript Framework</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    <strong>Slug-Hinweis:</strong> Im <code>campaign</code>-Prop müssen Sie Ihren
                    Kampagnen-Slug aus dem Dashboard übergeben!
                  </AlertDescription>
                </Alert>

                <Tabs defaultValue="nuxt" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="nuxt">Nuxt 3</TabsTrigger>
                    <TabsTrigger value="vue">Vue 3</TabsTrigger>
                  </TabsList>

                  <TabsContent value="nuxt" className="space-y-4">
                    <div className="relative">
                      <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                        <code>{`<!-- components/KundenmagnetWidget.vue -->
<template>
  <div>
    <div
      data-kundenmagnet-widget
      :data-campaign="campaign"
      :data-limit="limit"
      :data-theme="theme"
    />
  </div>
</template>

<script setup lang="ts">
// Props mit TypeScript
interface Props {
  campaign: string  // Kampagnen-Slug aus Dashboard!
  limit?: number
  theme?: 'light' | 'dark' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  limit: 10,
  theme: 'light'
})

// Script laden
useHead({
  script: [
    {
      src: 'https://kundenmagnet-app.de/widget.js',
      async: true
    }
  ]
})
</script>

<!-- Verwendung in Ihrer Seite:
     
     <KundenmagnetWidget campaign="ihr-slug" :limit="8" />
     
     WICHTIG: "ihr-slug" durch Ihren Kampagnen-Slug ersetzen!
     Dashboard → Kampagnen → Widget-Slug kopieren
-->`}</code>
                      </pre>
                      <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="vue" className="space-y-4">
                    <div className="relative">
                      <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                        <code>{`<!-- components/KundenmagnetWidget.vue -->
<template>
  <div>
    <div
      data-kundenmagnet-widget
      :data-campaign="campaign"
      :data-limit="limit"
      :data-theme="theme"
    />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

// Props definieren
const props = defineProps({
  campaign: {
    type: String,
    required: true  // Kampagnen-Slug ist Pflicht!
  },
  limit: {
    type: Number,
    default: 10
  },
  theme: {
    type: String,
    default: 'light'
  }
})

let script = null

onMounted(() => {
  script = document.createElement('script')
  script.src = 'https://kundenmagnet-app.de/widget.js'
  script.async = true
  document.body.appendChild(script)
})

onUnmounted(() => {
  if (script) {
    document.body.removeChild(script)
  }
})
</script>

<!-- Verwendung:
     
     <KundenmagnetWidget campaign="ihr-slug" :limit="8" />
     
     WICHTIG: "ihr-slug" ersetzen!
     Dashboard → Kampagnen → Widget-Slug
-->`}</code>
                      </pre>
                      <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Angular */}
            <Card id="angular" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>🅰️</span> Angular
                </CardTitle>
                <CardDescription>Enterprise TypeScript Framework</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    <strong>Slug-Hinweis:</strong> Übergeben Sie Ihren Kampagnen-Slug als{' '}
                    <code>@Input()</code> an die Komponente!
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Schritt 1:</strong> Script in <code>angular.json</code> registrieren:
                  </p>

                  <div className="relative">
                    <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                      <code>{`// angular.json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "scripts": [
              "https://kundenmagnet-app.de/widget.js"
            ]
          }
        }
      }
    }
  }
}`}</code>
                    </pre>
                    <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    <strong>Schritt 2:</strong> Komponente erstellen:
                  </p>

                  <div className="relative">
                    <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                      <code>{`// kundenmagnet-widget.component.ts
import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-kundenmagnet-widget',
  template: \`
    <div
      data-kundenmagnet-widget
      [attr.data-campaign]="campaign"
      [attr.data-limit]="limit"
      [attr.data-theme]="theme"
    ></div>
  \`,
  standalone: true
})
export class KundenmagnetWidgetComponent {
  @Input() campaign!: string  // Kampagnen-Slug aus Dashboard!
  @Input() limit: number = 10
  @Input() theme: 'light' | 'dark' | 'auto' = 'light'
}

/* Verwendung in Ihrem Template:
   
   <app-kundenmagnet-widget 
     campaign="ihr-slug" 
     [limit]="8"
     theme="light">
   </app-kundenmagnet-widget>
   
   WICHTIG: "ihr-slug" durch Ihren Kampagnen-Slug ersetzen!
   Dashboard → Kampagnen → Widget-Slug kopieren
*/`}</code>
                    </pre>
                    <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Svelte/SvelteKit */}
            <Card id="svelte" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>🔥</span> Svelte / SvelteKit
                </CardTitle>
                <CardDescription>Cybernetically Enhanced Web Apps</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    <strong>Slug-Hinweis:</strong> Übergeben Sie Ihren Kampagnen-Slug als Prop an
                    die Svelte-Komponente!
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="relative">
                    <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                      <code>{`<!-- KundenmagnetWidget.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  
  // Props mit TypeScript
  export let campaign: string  // Kampagnen-Slug aus Dashboard!
  export let limit: number = 10
  export let theme: 'light' | 'dark' | 'auto' = 'light'
  
  let script: HTMLScriptElement | null = null
  
  onMount(() => {
    script = document.createElement('script')
    script.src = 'https://kundenmagnet-app.de/widget.js'
    script.async = true
    document.body.appendChild(script)
  })
  
  onDestroy(() => {
    if (script) {
      document.body.removeChild(script)
    }
  })
</script>

<div
  data-kundenmagnet-widget
  data-campaign={campaign}
  data-limit={limit}
  data-theme={theme}
/>

<!-- Verwendung in Ihrer Seite:
     
     <script>
       import KundenmagnetWidget from './KundenmagnetWidget.svelte'
     </script>
     
     <KundenmagnetWidget campaign="ihr-slug" limit={8} />
     
     WICHTIG: "ihr-slug" durch Ihren Kampagnen-Slug ersetzen!
     Dashboard → Kampagnen → Widget-Slug kopieren
-->`}</code>
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

        {/* Phase 3: Erweiterte Integration */}
        <div className="mb-12">
          <div className="mb-6 flex items-center gap-2">
            <Plug className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Phase 3: Erweiterte Integration</h2>
          </div>

          <div className="space-y-8">
            {/* Google Tag Manager */}
            <Card id="gtm" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>📊</span> Google Tag Manager
                </CardTitle>
                <CardDescription>
                  Widget über GTM ohne Code-Änderungen auf der Website einbinden
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    <strong>Slug-Hinweis:</strong> Im GTM-Tag müssen Sie <code>ihr-slug</code> mit
                    Ihrem Kampagnen-Slug ersetzen!
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  {[
                    { step: 1, title: 'Google Tag Manager öffnen' },
                    { step: 2, title: 'Neuen Tag erstellen → "Custom HTML"' },
                    {
                      step: 3,
                      title: 'HTML-Code einfügen (siehe unten)',
                      content: true,
                    },
                    {
                      step: 4,
                      title:
                        'Trigger auswählen: "All Pages" oder spezifische Seite (z.B. "/bewertungen")',
                    },
                    { step: 5, title: 'Tag speichern und Container veröffentlichen' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        {item.content && (
                          <div className="relative mt-2">
                            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                              <code>{`<!-- GTM Custom HTML Tag -->
<div 
  data-kundenmagnet-widget
  data-campaign="ihr-slug"
  data-limit="10"
  data-theme="light"
></div>
<script src="https://kundenmagnet-app.de/widget.js" async></script>

<!-- WICHTIG: "ihr-slug" durch Ihren Kampagnen-Slug ersetzen! -->
<!-- Dashboard → Kampagnen → Widget-Slug kopieren -->
<!-- Beispiel: data-campaign="gtm-website" -->`}</code>
                            </pre>
                            <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Alert className="border-green-200 bg-green-50">
                  <AlertCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-900">
                    <strong>Vorteil:</strong> Sie können das Widget über GTM auf mehreren Seiten
                    gleichzeitig deployen ohne Code-Änderungen auf der Website!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* CSP */}
            <Card id="csp" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>🔒</span> Content Security Policy (CSP)
                </CardTitle>
                <CardDescription>
                  Widget in Umgebungen mit strikten Security-Richtlinien
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-900">
                    <strong>Wichtig:</strong> Auch bei CSP-Konfiguration müssen Sie in Ihrem
                    Widget-Code <code>ihr-slug</code> mit Ihrem Kampagnen-Slug ersetzen!
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Falls Ihre Website eine strikte Content Security Policy hat, fügen Sie diese
                    Domains zur Whitelist hinzu:
                  </p>

                  <div className="relative">
                    <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                      <code>{`Content-Security-Policy:
  script-src 'self' https://kundenmagnet-app.de;
  frame-src 'self' https://kundenmagnet-app.de;
  connect-src 'self' https://kundenmagnet-app.de;`}</code>
                    </pre>
                    <Button size="sm" variant="ghost" className="absolute right-2 top-2">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>

                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-900">
                      <strong>Alternative:</strong> Verwenden Sie die iFrame-Variante, die in den
                      meisten CSP-Umgebungen problemlos funktioniert:
                      <code className="mt-2 block text-xs">
                        &lt;iframe
                        src=&quot;https://kundenmagnet-app.de/widget/frame?campaign=ihr-slug&quot;
                        ...&gt;&lt;/iframe&gt;
                      </code>
                      <div className="mt-2 text-xs">
                        (Ersetzen Sie <code>ihr-slug</code> mit Ihrem Kampagnen-Slug!)
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            {/* Caching */}
            <Card id="caching" className="scroll-mt-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span>⚡</span> Caching & CDN-Integration
                </CardTitle>
                <CardDescription>
                  Widget mit Cloudflare, Fastly oder anderen CDNs optimieren
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    <strong>Slug-Hinweis:</strong> Unabhängig von Ihrer Cache-Konfiguration müssen
                    Sie in Ihrem Widget-Code <code>ihr-slug</code> mit Ihrem Kampagnen-Slug
                    ersetzen!
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h4 className="font-semibold">Widget ist bereits optimiert für Caching:</h4>

                  <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                    <li>
                      <strong>Browser-Cache:</strong> Widget.js cached 5 Minuten
                    </li>
                    <li>
                      <strong>API-Cache:</strong> Testimonials cached 60 Sekunden
                    </li>
                    <li>
                      <strong>iFrame:</strong> Wird von CDNs automatisch cached
                    </li>
                    <li>
                      <strong>Shadow DOM:</strong> Verhindert CSS-Konflikte
                    </li>
                  </ul>

                  <Alert className="border-green-200 bg-green-50">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-900">
                      <strong>Empfehlung:</strong> Verwenden Sie die iFrame-Variante für maximale
                      CDN-Kompatibilität:
                      <code className="mt-2 block text-xs">
                        &lt;iframe
                        src=&quot;https://kundenmagnet-app.de/widget/frame?campaign=ihr-slug&quot;
                        ...&gt;&lt;/iframe&gt;
                      </code>
                      <div className="mt-2 text-xs">
                        (Dashboard → Kampagnen → Widget-Slug für <code>ihr-slug</code> kopieren!)
                      </div>
                    </AlertDescription>
                  </Alert>

                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                    <h4 className="mb-2 text-sm font-semibold text-yellow-900">
                      Nach Widget-Updates:
                    </h4>
                    <ul className="space-y-1 text-xs text-yellow-800">
                      <li>• Cache leeren: Browser (Strg+Shift+R)</li>
                      <li>• CDN purgen: Falls Sie Cloudflare/Fastly verwenden</li>
                      <li>• WordPress: WP Rocket / W3 Total Cache leeren</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Support */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Weitere Hilfe benötigt?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-600 p-2 text-white">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">E-Mail Support</h4>
                  <a
                    href="mailto:support@kundenmagnet-app.de"
                    className="text-blue-600 hover:underline"
                  >
                    support@kundenmagnet-app.de
                  </a>
                  <p className="mt-1 text-xs text-blue-700">
                    Bitte geben Sie Ihren Kampagnen-Slug an, wenn Sie Hilfe benötigen!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-600 p-2 text-white">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">Weitere Dokumentation</h4>
                  <div className="space-y-1">
                    <Link href="/docs" className="block text-sm text-blue-600 hover:underline">
                      Übersicht Dokumentation
                    </Link>
                    <Link
                      href="/docs/widget"
                      className="block text-sm text-blue-600 hover:underline"
                    >
                      Widget-Dokumentation
                    </Link>
                    <Link href="/docs/api" className="block text-sm text-blue-600 hover:underline">
                      API-Dokumentation
                    </Link>
                  </div>
                </div>
              </div>

              <Alert className="border-blue-300 bg-blue-100">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-900">
                  <strong>Live-Chat:</strong> Verfügbar im Dashboard (unten rechts)
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
