// app/docs/widget/page.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BRAND } from '@/lib/constants'
import { Code, Copy, Zap } from 'lucide-react'

export default function WidgetDocsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">Widget Integration</h1>
          <p className="text-xl text-muted-foreground">
            Integrieren Sie {BRAND.name} Bewertungen in wenigen Sekunden in Ihre Website
          </p>
        </div>

        <div className="space-y-8">
          {/* Quick Start */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle>Schnellstart</CardTitle>
              </div>
              <CardDescription>
                Die einfachste Art, Bewertungen auf Ihrer Website zu zeigen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Kopieren Sie diesen Code und fügen Sie ihn dort ein, wo die Bewertungen erscheinen
                  sollen:
                </p>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
                    <code>{`<script src="https://widget.${BRAND.domain}/embed.js"></script>
<div data-kundenmagnet-widget="IHRE-WIDGET-ID"></div>`}</code>
                  </pre>
                  <Button size="sm" variant="outline" className="absolute right-2 top-2">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ersetzen Sie <code className="text-primary">IHRE-WIDGET-ID</code> mit Ihrer
                  tatsächlichen Widget-ID aus dem Dashboard.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* WordPress */}
          <Card>
            <CardHeader>
              <CardTitle>WordPress Integration</CardTitle>
              <CardDescription>Für WordPress-Websites empfehlen wir unser Plugin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="steps space-y-3">
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      1
                    </div>
                    <p className="text-sm">Plugin im WordPress Admin-Bereich installieren</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      2
                    </div>
                    <p className="text-sm">
                      API-Schlüssel aus Ihrem {BRAND.name} Dashboard eingeben
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      3
                    </div>
                    <p className="text-sm">
                      Shortcode <code className="text-primary">[kundenmagnet-reviews]</code>{' '}
                      verwenden
                    </p>
                  </div>
                </div>
                <Button variant="outline">WordPress Plugin herunterladen</Button>
              </div>
            </CardContent>
          </Card>

          {/* Shopify */}
          <Card>
            <CardHeader>
              <CardTitle>Shopify Integration</CardTitle>
              <CardDescription>Perfekt für Online-Shops</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Unsere Shopify-App installiert sich automatisch und zeigt Bewertungen auf
                  Produktseiten an.
                </p>
                <div className="steps space-y-3">
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      1
                    </div>
                    <p className="text-sm">App aus dem Shopify App Store installieren</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      2
                    </div>
                    <p className="text-sm">{BRAND.name} Account verknüpfen</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      3
                    </div>
                    <p className="text-sm">Theme anpassen und Widget positionieren</p>
                  </div>
                </div>
                <Button variant="outline">Shopify App installieren</Button>
              </div>
            </CardContent>
          </Card>

          {/* Customization */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                <CardTitle>Anpassung</CardTitle>
              </div>
              <CardDescription>Passen Sie das Widget an Ihr Design an</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Das Widget kann über CSS-Variablen und Data-Attribute angepasst werden:
                </p>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
                    <code>{`<div 
  data-kundenmagnet-widget="IHRE-WIDGET-ID"
  data-theme="light"
  data-layout="grid"
  data-max-reviews="6"
  data-show-stars="true"
  data-show-date="false"
>
</div>`}</code>
                  </pre>
                  <Button size="sm" variant="outline" className="absolute right-2 top-2">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium">Verfügbare Themes:</h4>
                    <ul className="text-xs text-muted-foreground">
                      <li>• light (Standard)</li>
                      <li>• dark</li>
                      <li>• minimal</li>
                      <li>• colorful</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Layout-Optionen:</h4>
                    <ul className="text-xs text-muted-foreground">
                      <li>• list (Standard)</li>
                      <li>• grid</li>
                      <li>• carousel</li>
                      <li>• compact</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
              <CardDescription>Das Widget ist für Geschwindigkeit optimiert</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">&lt; 50KB</div>
                  <div className="text-sm text-muted-foreground">Gesamtgröße</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">&lt; 100ms</div>
                  <div className="text-sm text-muted-foreground">Ladezeit</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">CDN</div>
                  <div className="text-sm text-muted-foreground">Weltweit verteilt</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
