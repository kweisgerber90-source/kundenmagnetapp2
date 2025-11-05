// app/docs/widget/page.tsx
'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, CheckCircle2, Code2, Copy, Globe, Rocket, Shield, Zap } from 'lucide-react'
import { useState } from 'react'

export default function WidgetDocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const iframeCode = `<!-- Kundenmagnet Widget (iFrame) -->
<iframe
  src="https://kundenmagnet-app.de/widget/frame?campaign=ihr-slug&limit=10"
  style="width: 100%; border: none; min-height: 400px;"
  title="Kundenbewertungen"
></iframe>`

  const scriptCode = `<!-- Kundenmagnet Widget (JavaScript mit Fallback) -->
<div 
  data-kundenmagnet-widget
  data-campaign="ihr-slug"
  data-limit="10"
  data-theme="light"
></div>
<script src="https://kundenmagnet-app.de/widget.js" async></script>`

  const wordpressCode = `<!-- WordPress HTML-Block -->
<iframe
  src="https://kundenmagnet-app.de/widget/frame?campaign=ihr-slug&limit=10"
  style="width: 100%; border: none; min-height: 400px;"
  title="Kundenbewertungen"
></iframe>`

  const shopifyCode = `<!-- Shopify Custom Liquid -->
<div class="kundenmagnet-section">
  <h2>Das sagen unsere Kunden</h2>
  <iframe
    src="https://kundenmagnet-app.de/widget/frame?campaign=ihr-slug&limit=8"
    style="width: 100%; border: none; min-height: 500px;"
    title="Kundenbewertungen"
  ></iframe>
</div>

<style>
.kundenmagnet-section {
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 20px;
}
</style>`

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Widget Integration</h1>
        <p className="text-lg text-gray-600">
          Integrieren Sie Kundenmagnetapp Bewertungen in wenigen Sekunden in Ihre Website
        </p>
      </div>

      {/* Schnellstart */}
      <Card className="mb-8 border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-blue-900">Schnellstart (2 Minuten)</CardTitle>
          </div>
          <CardDescription className="text-blue-700">
            Die einfachste Art, Bewertungen auf Ihrer Website zu zeigen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                1
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-blue-900">Widget-Code generieren</h3>
                <p className="text-sm text-blue-700">
                  Dashboard → Widget → Kampagne auswählen → Code kopieren
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                2
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-blue-900">Code auf Website einfügen</h3>
                <p className="text-sm text-blue-700">
                  Fügen Sie den kopierten Code an der gewünschten Stelle ein
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                ✓
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-blue-900">Fertig! 🎉</h3>
                <p className="text-sm text-blue-700">
                  Ihre Bewertungen werden jetzt auf Ihrer Website angezeigt
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Einbettungsmethoden */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Einbettungsmethoden</CardTitle>
          <CardDescription>Wählen Sie die passende Methode für Ihre Website</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="iframe" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="iframe" className="gap-2">
                <Globe className="h-4 w-4" />
                iFrame (Empfohlen)
              </TabsTrigger>
              <TabsTrigger value="script" className="gap-2">
                <Code2 className="h-4 w-4" />
                JavaScript
              </TabsTrigger>
            </TabsList>

            <TabsContent value="iframe" className="space-y-4">
              <Alert>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <strong>Empfohlen für WordPress</strong> - Funktioniert überall, keine
                  JavaScript-Probleme, automatische Höhenanpassung
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <h3 className="font-semibold">Vorteile:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span>Funktioniert überall (100% Kompatibilität)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span>WordPress-freundlich (keine Plugin-Konflikte)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span>Keine JavaScript-Probleme oder CORS-Fehler</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span>Kein Cookie-Banner erforderlich</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span>Automatische Höhenanpassung</span>
                  </li>
                </ul>
              </div>

              <div className="relative">
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                  <code>{iframeCode}</code>
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute right-2 top-2"
                  onClick={() => copyToClipboard(iframeCode, 'iframe')}
                >
                  {copiedCode === 'iframe' ? (
                    <>
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Kopiert!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1 h-3 w-3" />
                      Kopieren
                    </>
                  )}
                </Button>
              </div>

              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-900">
                  Ersetzen Sie <code className="font-bold">ihr-slug</code> mit Ihrem tatsächlichen
                  Kampagnen-Slug aus dem Dashboard
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="script" className="space-y-4">
              <Alert>
                <Zap className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <strong>Mit automatischem Fallback</strong> - Bessere Performance und
                  Style-Integration, wechselt automatisch zu iFrame bei Problemen
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <h3 className="font-semibold">Vorteile:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Zap className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <span>Schnellere Performance durch Shadow DOM</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <span>Bessere Integration in Ihr Website-Design</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <span>Automatischer Fallback zu iFrame bei Problemen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <span>Browser-Caching für optimale Ladezeiten</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h4 className="mb-2 text-sm font-semibold">Wie der Fallback funktioniert:</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">1.</span>
                    <span>Widget versucht JavaScript-Version zu laden</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">↓</span>
                    <span className="text-xs text-gray-500">Bei CORS/CSP-Problemen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">2.</span>
                    <span>Widget wechselt automatisch zu iFrame</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">↓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-600">
                      Bewertungen werden IMMER angezeigt!
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                  <code>{scriptCode}</code>
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute right-2 top-2"
                  onClick={() => copyToClipboard(scriptCode, 'script')}
                >
                  {copiedCode === 'script' ? (
                    <>
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Kopiert!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1 h-3 w-3" />
                      Kopieren
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Plattform-spezifische Anleitungen */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Plattform-spezifische Anleitungen</CardTitle>
          <CardDescription>
            Detaillierte Schritt-für-Schritt Anleitungen für verschiedene Plattformen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="wordpress" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="wordpress">WordPress</TabsTrigger>
              <TabsTrigger value="shopify">Shopify</TabsTrigger>
              <TabsTrigger value="wix">Wix</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
            </TabsList>

            <TabsContent value="wordpress" className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-900">
                  <strong>Empfehlung für WordPress:</strong> Verwenden Sie die iFrame-Variante für
                  maximale Kompatibilität mit Security-Plugins und Cache-Systemen
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h3 className="mb-3 font-semibold">Methode: HTML-Block (Empfohlen)</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold">
                        1
                      </div>
                      <p className="text-sm text-gray-600">
                        Öffnen Sie die Seite/den Beitrag im <strong>Block-Editor</strong>
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold">
                        2
                      </div>
                      <p className="text-sm text-gray-600">
                        Klicken Sie auf <strong>&quot;+&quot;</strong> →{' '}
                        <strong>&quot;Benutzerdefiniertes HTML&quot;</strong>
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold">
                        3
                      </div>
                      <p className="text-sm text-gray-600">
                        Fügen Sie den Widget-Code ein und klicken Sie{' '}
                        <strong>&quot;Veröffentlichen&quot;</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                    <code>{wordpressCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute right-2 top-2"
                    onClick={() => copyToClipboard(wordpressCode, 'wordpress')}
                  >
                    {copiedCode === 'wordpress' ? (
                      <>
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Kopiert!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1 h-3 w-3" />
                        Kopieren
                      </>
                    )}
                  </Button>
                </div>

                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <h4 className="mb-2 flex items-center gap-2 font-semibold text-green-900">
                    <CheckCircle2 className="h-5 w-5" />
                    Warum iFrame für WordPress?
                  </h4>
                  <ul className="space-y-1 text-sm text-green-800">
                    <li>• Keine Konflikte mit Security-Plugins (Wordfence, iThemes, etc.)</li>
                    <li>• Funktioniert trotz CSP/CORS-Einschränkungen</li>
                    <li>• Keine Cache-Plugin-Probleme</li>
                    <li>• 100% garantierte Funktionalität</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="shopify" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="mb-3 font-semibold">Installation im Theme-Editor</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold">
                        1
                      </div>
                      <p className="text-sm text-gray-600">
                        <strong>Online Store → Themes → Customize</strong>
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold">
                        2
                      </div>
                      <p className="text-sm text-gray-600">
                        Wählen Sie die Seite (z.B. Home, About)
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold">
                        3
                      </div>
                      <p className="text-sm text-gray-600">
                        Fügen Sie <strong>&quot;Custom Liquid&quot;</strong> Section hinzu
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold">
                        4
                      </div>
                      <p className="text-sm text-gray-600">
                        Fügen Sie den Code ein und speichern Sie
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                    <code>{shopifyCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute right-2 top-2"
                    onClick={() => copyToClipboard(shopifyCode, 'shopify')}
                  >
                    {copiedCode === 'shopify' ? (
                      <>
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Kopiert!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1 h-3 w-3" />
                        Kopieren
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="wix" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold">
                      1
                    </div>
                    <p className="text-sm text-gray-600">
                      Öffnen Sie die <strong>Seite im Editor</strong>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold">
                      2
                    </div>
                    <p className="text-sm text-gray-600">
                      Klicken Sie auf <strong>&quot;+&quot;</strong> → <strong>&quot;Embed&quot; → &quot;Embed Code&quot;</strong>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold">
                      3
                    </div>
                    <p className="text-sm text-gray-600">
                      Wählen Sie <strong>&quot;Code&quot;</strong>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold">
                      4
                    </div>
                    <p className="text-sm text-gray-600">
                      Fügen Sie den Widget-Code ein (iFrame empfohlen)
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold">
                      5
                    </div>
                    <p className="text-sm text-gray-600">
                      Passen Sie die Größe an und klicken Sie <strong>&quot;Veröffentlichen&quot;</strong>
                    </p>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Tipp:</strong> Verwenden Sie die iFrame-Variante für beste
                    Wix-Kompatibilität
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            <TabsContent value="html" className="space-y-4">
              <div className="relative">
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                  <code>{`<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meine Website</title>
</head>
<body>
    <!-- Ihre Inhalte -->
    
    <section class="testimonials">
        <h2>Kundenbewertungen</h2>
        
        <!-- Widget hier einfügen -->
        <iframe
          src="https://kundenmagnet-app.de/widget/frame?campaign=ihr-slug"
          style="width: 100%; border: none; min-height: 400px;"
          title="Kundenbewertungen"
        ></iframe>
    </section>
    
    <!-- Oder JavaScript-Version: -->
    <!--
    <div data-kundenmagnet-widget data-campaign="ihr-slug"></div>
    <script src="https://kundenmagnet-app.de/widget.js" async></script>
    -->
</body>
</html>`}</code>
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute right-2 top-2"
                  onClick={() =>
                    copyToClipboard(
                      `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meine Website</title>
</head>
<body>
    <section class="testimonials">
        <h2>Kundenbewertungen</h2>
        <iframe
          src="https://kundenmagnet-app.de/widget/frame?campaign=ihr-slug"
          style="width: 100%; border: none; min-height: 400px;"
          title="Kundenbewertungen"
        ></iframe>
    </section>
</body>
</html>`,
                      'html',
                    )
                  }
                >
                  {copiedCode === 'html' ? (
                    <>
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Kopiert!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1 h-3 w-3" />
                      Kopieren
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Konfigurationsparameter */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Konfigurationsparameter</CardTitle>
          <CardDescription>Passen Sie das Widget an Ihre Bedürfnisse an</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left font-semibold">Parameter</th>
                  <th className="p-3 text-left font-semibold">Typ</th>
                  <th className="p-3 text-left font-semibold">Standard</th>
                  <th className="p-3 text-left font-semibold">Beschreibung</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-3">
                    <code className="rounded bg-gray-100 px-2 py-1 text-xs">campaign</code>
                  </td>
                  <td className="p-3 text-gray-600">String</td>
                  <td className="p-3 text-gray-600">-</td>
                  <td className="p-3 text-gray-600">
                    <strong>Pflicht:</strong> Kampagnen-Slug aus dem Dashboard
                  </td>
                </tr>
                <tr>
                  <td className="p-3">
                    <code className="rounded bg-gray-100 px-2 py-1 text-xs">limit</code>
                  </td>
                  <td className="p-3 text-gray-600">Number</td>
                  <td className="p-3 text-gray-600">10</td>
                  <td className="p-3 text-gray-600">Anzahl der angezeigten Bewertungen (1-50)</td>
                </tr>
                <tr>
                  <td className="p-3">
                    <code className="rounded bg-gray-100 px-2 py-1 text-xs">sort</code>
                  </td>
                  <td className="p-3 text-gray-600">String</td>
                  <td className="p-3 text-gray-600">newest</td>
                  <td className="p-3 text-gray-600">Sortierung: newest, oldest, highest, lowest</td>
                </tr>
                <tr>
                  <td className="p-3">
                    <code className="rounded bg-gray-100 px-2 py-1 text-xs">theme</code>
                  </td>
                  <td className="p-3 text-gray-600">String</td>
                  <td className="p-3 text-gray-600">light</td>
                  <td className="p-3 text-gray-600">Farbschema: light, dark, auto</td>
                </tr>
                <tr>
                  <td className="p-3">
                    <code className="rounded bg-gray-100 px-2 py-1 text-xs">title</code>
                  </td>
                  <td className="p-3 text-gray-600">String</td>
                  <td className="p-3 text-gray-600">Kundenbewertungen</td>
                  <td className="p-3 text-gray-600">Widget-Überschrift (nur JavaScript)</td>
                </tr>
                <tr>
                  <td className="p-3">
                    <code className="rounded bg-gray-100 px-2 py-1 text-xs">show-rating</code>
                  </td>
                  <td className="p-3 text-gray-600">Boolean</td>
                  <td className="p-3 text-gray-600">true</td>
                  <td className="p-3 text-gray-600">Sterne anzeigen (nur JavaScript)</td>
                </tr>
                <tr>
                  <td className="p-3">
                    <code className="rounded bg-gray-100 px-2 py-1 text-xs">animation</code>
                  </td>
                  <td className="p-3 text-gray-600">Boolean</td>
                  <td className="p-3 text-gray-600">true</td>
                  <td className="p-3 text-gray-600">Animationen aktivieren (nur JavaScript)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="font-semibold">Beispiel-Konfigurationen:</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-gray-200 p-4">
                <h4 className="mb-2 text-sm font-semibold">Top 5 Bewertungen</h4>
                <pre className="overflow-x-auto rounded bg-gray-50 p-2 text-xs">
                  <code>?campaign=ihr-slug&limit=5&sort=highest</code>
                </pre>
              </Card>
              <Card className="border-gray-200 p-4">
                <h4 className="mb-2 text-sm font-semibold">Dark Mode</h4>
                <pre className="overflow-x-auto rounded bg-gray-50 p-2 text-xs">
                  <code>?campaign=ihr-slug&theme=dark</code>
                </pre>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Troubleshooting</CardTitle>
          <CardDescription>Lösungen für häufige Probleme</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Widget wird nicht angezeigt</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="mb-1 font-semibold">1. Kampagnen-Slug prüfen</h4>
                    <p className="text-gray-600">
                      ✅ Richtig: <code>data-campaign=&quot;hauptseite&quot;</code>
                    </p>
                    <p className="text-gray-600">
                      ❌ Falsch: <code>data-campaign=&quot;/r/hauptseite&quot;</code> (kein /r/ davor!)
                    </p>
                    <p className="mt-2 text-gray-600">
                      <strong>Slug finden:</strong> Dashboard → Kampagnen → blaue Box &quot;Widget-Slug&quot;
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">2. Bewertungen freigeben</h4>
                    <p className="text-gray-600">
                      Dashboard → Testimonials → Status muss &quot;Approved&quot; (grün) sein
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">3. Kampagne ist aktiv?</h4>
                    <p className="text-gray-600">
                      Dashboard → Kampagnen → Status muss &quot;Aktiv&quot; sein
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>WordPress: Widget lädt nicht</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm">
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-900">
                      <strong>Lösung 1 (Empfohlen):</strong> Verwenden Sie die iFrame-Variante
                    </AlertDescription>
                  </Alert>
                  <div className="relative">
                    <pre className="overflow-x-auto rounded-lg bg-gray-900 p-3 text-xs text-gray-100">
                      <code>{`<iframe
  src="https://kundenmagnet-app.de/widget/frame?campaign=ihr-slug"
  style="width: 100%; border: none; min-height: 400px;"
  title="Kundenbewertungen"
></iframe>`}</code>
                    </pre>
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">Lösung 2: Security-Plugin konfigurieren</h4>
                    <p className="text-gray-600">
                      Falls Sie Wordfence, iThemes Security o.ä. nutzen: Plugin-Einstellungen →
                      Whitelist → <code>kundenmagnet-app.de</code> hinzufügen
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">Lösung 3: Cache leeren</h4>
                    <p className="text-gray-600">
                      WP Rocket, W3 Total Cache etc.: Cache leeren nach Widget-Installation
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Widget zeigt keine Bewertungen</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Das ist normal!</strong> Widget funktioniert, aber noch keine
                      freigegebenen Bewertungen vorhanden.
                    </AlertDescription>
                  </Alert>
                  <div>
                    <h4 className="mb-1 font-semibold">Lösung:</h4>
                    <ol className="list-decimal space-y-1 pl-5 text-gray-600">
                      <li>Bewertungen sammeln (Bewertungslink /r/ihr-slug teilen)</li>
                      <li>Dashboard → Testimonials → Bewertungen freigeben</li>
                      <li>1-2 Minuten warten (Cache-Update)</li>
                      <li>Widget aktualisiert sich automatisch</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Fehler: &quot;Kampagne nicht gefunden&quot;</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm">
                  <p className="text-gray-600">
                    <strong>Ursachen:</strong>
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-gray-600">
                    <li>Falscher Kampagnen-Slug</li>
                    <li>Kampagne ist inaktiv oder pausiert</li>
                    <li>Kampagne wurde gelöscht</li>
                  </ul>
                  <p className="text-gray-600">
                    <strong>Lösung:</strong>
                  </p>
                  <ol className="list-decimal space-y-1 pl-5 text-gray-600">
                    <li>Slug im Dashboard prüfen und neu kopieren</li>
                    <li>Kampagne auf &quot;Aktiv&quot; setzen</li>
                    <li>Code auf Website aktualisieren</li>
                  </ol>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Widget lädt langsam</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="mb-1 font-semibold">1. Limit reduzieren</h4>
                    <p className="text-gray-600">
                      Zeigen Sie weniger Bewertungen (z.B. <code>limit=10</code> statt{' '}
                      <code>limit=50</code>)
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">
                      2. async-Attribut nutzen (JavaScript-Version)
                    </h4>
                    <p className="text-gray-600">
                      ✅ <code>&lt;script src=&quot;...&quot; async&gt;&lt;/script&gt;</code>
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">3. Script am Ende laden</h4>
                    <p className="text-gray-600">
                      Platzieren Sie das Script vor <code>&lt;/body&gt;</code>, nicht in{' '}
                      <code>&lt;head&gt;</code>
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Häufig gestellte Fragen (FAQ)</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="faq-1">
              <AccordionTrigger>Ist das Widget kostenlos?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-600">
                  14 Tage kostenlos testen. Danach ab 9€/Monat zzgl. 19% MwSt.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2">
              <AccordionTrigger>Funktioniert das Widget auf meiner Plattform?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-600">
                  Ja! Die iFrame-Version funktioniert auf 100% aller Plattformen (WordPress,
                  Shopify, Wix, Webflow, statisches HTML, etc.).
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3">
              <AccordionTrigger>Welche Variante soll ich verwenden?</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <strong>WordPress:</strong> iFrame (empfohlen)
                  </p>
                  <p>
                    <strong>Andere Plattformen:</strong> Beide Varianten funktionieren
                  </p>
                  <p>
                    <strong>Bei Problemen:</strong> Immer iFrame verwenden
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4">
              <AccordionTrigger>Ist das Widget DSGVO-konform?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-600">
                  Ja, 100%. Alle Server in Deutschland (Frankfurt). Die iFrame-Variante benötigt
                  keinen Cookie-Banner.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5">
              <AccordionTrigger>Wie sammle ich Bewertungen?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-600">
                  Teilen Sie den Bewertungslink aus dem Dashboard:{' '}
                  <code>https://kundenmagnet-app.de/r/ihr-slug</code>. Per E-Mail, WhatsApp, QR-Code
                  oder Website-Footer.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6">
              <AccordionTrigger>Muss ich Bewertungen freigeben?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-600">
                  Ja, zum Schutz vor Spam. Gehen Sie zu Dashboard → Testimonials → klicken Sie
                  &quot;Freigeben&quot;. Nur freigegebene Bewertungen erscheinen im Widget.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-7">
              <AccordionTrigger>Kann ich das Design anpassen?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-600">
                  Ja, mit CSS für den Container oder nutzen Sie die Theme-Optionen (light, dark,
                  auto). Siehe Abschnitt &quot;Konfigurationsparameter&quot; oben.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-8">
              <AccordionTrigger>Ist das Widget responsive?</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-600">
                  Ja! Das Widget passt sich automatisch an alle Bildschirmgrößen an (Desktop,
                  Tablet, Mobile).
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Support */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Brauchen Sie Hilfe?</CardTitle>
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
                  <a href="/docs" className="block text-sm text-blue-600 hover:underline">
                    Übersicht Dokumentation
                  </a>
                  <a
                    href="/docs/install/platforms"
                    className="block text-sm text-blue-600 hover:underline"
                  >
                    Plattform-Anleitungen
                  </a>
                  <a href="/docs/api" className="block text-sm text-blue-600 hover:underline">
                    API-Dokumentation
                  </a>
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

      {/* Checkliste */}
      <Card className="mt-8 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <CheckCircle2 className="h-6 w-6" />
            Installation erfolgreich
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-green-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
              <span>Kampagne erstellt</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
              <span>Kampagnen-Slug kopiert</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
              <span>Widget-Code generiert</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
              <span>Code auf Website eingefügt</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
              <span>Mindestens eine Bewertung freigegeben</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Rocket className="h-6 w-6 text-green-600" />
              <span className="font-semibold">Widget ist jetzt live! 🎉</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
