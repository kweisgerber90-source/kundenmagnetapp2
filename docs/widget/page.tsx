// /docs/widget/page.tsx
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card } from '@/components/ui/card'
import { Code2, Globe, Shield, Zap } from 'lucide-react'

export default function WidgetDocsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Widget-Dokumentation</h1>

      <div className="space-y-8">
        {/* Übersicht */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Übersicht</h2>
          <p className="mb-4 text-gray-600">
            Das Kundenmagnet-Widget ermöglicht es Ihnen, genehmigte Kundenbewertungen auf Ihrer
            Website anzuzeigen. Es gibt zwei Einbettungsmethoden:
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4">
              <div className="mb-2 flex items-center">
                <Code2 className="mr-2 h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">JavaScript (Shadow DOM)</h3>
              </div>
              <p className="text-sm text-gray-600">
                Moderne Lösung mit isolierten Styles, Caching und optimaler Performance
              </p>
            </Card>

            <Card className="p-4">
              <div className="mb-2 flex items-center">
                <Globe className="mr-2 h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">iFrame</h3>
              </div>
              <p className="text-sm text-gray-600">
                Fallback für restriktive Umgebungen ohne JavaScript-Abhängigkeit
              </p>
            </Card>
          </div>
        </section>

        {/* Installation */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Installation</h2>

          <h3 className="mb-3 text-lg font-semibold">JavaScript-Widget</h3>
          <Card className="mb-4 p-4">
            <pre className="overflow-x-auto text-sm">
              <code>{`<!-- An der gewünschten Stelle einfügen -->
<div 
  data-kundenmagnet-widget
  data-campaign="ihr-kampagnen-slug"
  data-limit="10"
  data-sort="newest"
  data-theme="light"
></div>

<!-- Vor dem schließenden </body> Tag -->
<script src="https://kundenmagnet-app.de/widget.js" async></script>`}</code>
            </pre>
          </Card>

          <h3 className="mb-3 text-lg font-semibold">iFrame-Widget</h3>
          <Card className="p-4">
            <pre className="overflow-x-auto text-sm">
              <code>{`<iframe
  src="https://kundenmagnet-app.de/widget/frame?campaign=ihr-kampagnen-slug"
  style="width: 100%; border: none; min-height: 400px;"
  title="Kundenbewertungen"
></iframe>`}</code>
            </pre>
          </Card>
        </section>

        {/* Parameter */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Parameter</h2>

          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left">Parameter</th>
                  <th className="border p-2 text-left">Typ</th>
                  <th className="border p-2 text-left">Standard</th>
                  <th className="border p-2 text-left">Beschreibung</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-mono text-sm">campaign</td>
                  <td className="border p-2">String</td>
                  <td className="border p-2">-</td>
                  <td className="border p-2">Pflicht. Kampagnen-Slug</td>
                </tr>
                <tr>
                  <td className="border p-2 font-mono text-sm">limit</td>
                  <td className="border p-2">Number</td>
                  <td className="border p-2">10</td>
                  <td className="border p-2">Anzahl der Bewertungen (1-50)</td>
                </tr>
                <tr>
                  <td className="border p-2 font-mono text-sm">sort</td>
                  <td className="border p-2">String</td>
                  <td className="border p-2">newest</td>
                  <td className="border p-2">newest | oldest | rating</td>
                </tr>
                <tr>
                  <td className="border p-2 font-mono text-sm">theme</td>
                  <td className="border p-2">String</td>
                  <td className="border p-2">light</td>
                  <td className="border p-2">light | dark | auto</td>
                </tr>
                <tr>
                  <td className="border p-2 font-mono text-sm">title</td>
                  <td className="border p-2">String</td>
                  <td className="border p-2">Kundenbewertungen</td>
                  <td className="border p-2">Widget-Überschrift</td>
                </tr>
                <tr>
                  <td className="border p-2 font-mono text-sm">show-rating</td>
                  <td className="border p-2">Boolean</td>
                  <td className="border p-2">true</td>
                  <td className="border p-2">Sterne anzeigen</td>
                </tr>
                <tr>
                  <td className="border p-2 font-mono text-sm">animation</td>
                  <td className="border p-2">Boolean</td>
                  <td className="border p-2">true</td>
                  <td className="border p-2">Einblend-Animation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Plattform-spezifische Anleitungen */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Plattform-Integration</h2>

          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="mb-2 font-semibold">WordPress</h3>
              <p className="mb-2 text-sm text-gray-600">
                Fügen Sie den Code in einen HTML-Block im Gutenberg-Editor ein oder nutzen Sie ein
                Custom HTML Widget.
              </p>
              <Alert>
                <AlertDescription>
                  Bei Minifizierungs-Plugins: Schließen Sie <code>/widget.js</code> von der
                  Optimierung aus.
                </AlertDescription>
              </Alert>
            </Card>

            <Card className="p-4">
              <h3 className="mb-2 font-semibold">Shopify</h3>
              <p className="text-sm text-gray-600">
                Nutzen Sie die Custom Liquid Section oder fügen Sie den Code in theme.liquid vor{' '}
                <code>{`</body>`}</code> ein.
              </p>
            </Card>

            <Card className="p-4">
              <h3 className="mb-2 font-semibold">Wix</h3>
              <p className="text-sm text-gray-600">
                Verwenden Sie das HTML-Element und fügen Sie den iFrame-Code ein. JavaScript-Widget
                funktioniert nur mit Premium-Plan.
              </p>
            </Card>

            <Card className="p-4">
              <h3 className="mb-2 font-semibold">Webflow</h3>
              <p className="text-sm text-gray-600">
                Embed-Element für den Code verwenden. Script in Site Settings → Custom Code
                einfügen.
              </p>
            </Card>
          </div>
        </section>

        {/* Sicherheit */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Sicherheit & Performance</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4">
              <Shield className="mb-2 h-5 w-5 text-green-600" />
              <h3 className="mb-2 font-semibold">Sicherheit</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Shadow DOM isoliert Styles</li>
                <li>• XSS-Schutz durch HTML-Escaping</li>
                <li>• CORS-Header konfiguriert</li>
                <li>• Rate-Limiting (100 Req/h)</li>
              </ul>
            </Card>

            <Card className="p-4">
              <Zap className="mb-2 h-5 w-5 text-yellow-600" />
              <h3 className="mb-2 font-semibold">Performance</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• LocalStorage-Cache (5 Min)</li>
                <li>• Async-Loading</li>
                <li>• Gzip-Kompression</li>
                <li>• CDN-Auslieferung</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* CSP */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Content Security Policy</h2>

          <Alert>
            <AlertDescription>
              Wenn Sie CSP verwenden, fügen Sie folgende Direktiven hinzu:
            </AlertDescription>
          </Alert>

          <Card className="mt-4 p-4">
            <pre className="overflow-x-auto text-sm">
              <code>{`script-src 'self' https://kundenmagnet-app.de;
frame-src 'self' https://kundenmagnet-app.de;
connect-src 'self' https://kundenmagnet-app.de;`}</code>
            </pre>
          </Card>
        </section>

        {/* Troubleshooting */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Fehlerbehebung</h2>

          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="mb-2 font-semibold">Widget wird nicht angezeigt</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Prüfen Sie den Kampagnen-Slug</li>
                <li>• Stellen Sie sicher, dass die Kampagne aktiv ist</li>
                <li>• Kontrollieren Sie die Browser-Konsole</li>
              </ul>
            </Card>

            <Card className="p-4">
              <h3 className="mb-2 font-semibold">Styles werden überschrieben</h3>
              <p className="text-sm text-gray-600">
                Das JavaScript-Widget nutzt Shadow DOM und ist isoliert. Bei iFrame: Höhe mit CSS
                anpassen.
              </p>
            </Card>

            <Card className="p-4">
              <h3 className="mb-2 font-semibold">CORS-Fehler</h3>
              <p className="text-sm text-gray-600">
                Kontaktieren Sie den Support mit Ihrer Domain für die Whitelist.
              </p>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Widget-Dokumentation - Kundenmagnet',
  description: 'Anleitung zur Integration des Kundenmagnet-Widgets',
}
