// /app/app/widget/page.tsx
// Widget-Konfigurator mit Live-Vorschau (wie Marketing-Seite)
'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Check, Copy, ExternalLink, Monitor, Smartphone, Tablet } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

// Beispiel-Testimonials für Vorschau
const DEMO_TESTIMONIALS = [
  {
    id: '1',
    name: 'Maria Schmidt',
    company: 'Schmidt GmbH',
    rating: 5,
    text: 'Absolut begeistert! Der Service ist erstklassig und das Team immer hilfsbereit. Kann ich nur weiterempfehlen!',
    date: '15.1.2024',
    verified: true,
  },
  {
    id: '2',
    name: 'Thomas Weber',
    company: '',
    rating: 5,
    text: 'Endlich eine Lösung, die wirklich funktioniert! Die Einrichtung war kinderleicht und der Support antwortet super schnell.',
    date: '10.1.2024',
    verified: true,
  },
  {
    id: '3',
    name: 'Julia Müller',
    company: 'Café Müller',
    rating: 5,
    text: 'Wir nutzen das Tool seit 3 Monaten und haben schon über 100 Bewertungen gesammelt. Die QR-Code Funktion ist genial!',
    date: '8.1.2024',
    verified: true,
  },
]

type Theme = 'light' | 'dark' | 'minimal' | 'colorful'
type Device = 'desktop' | 'tablet' | 'mobile'

export default function WidgetConfiguratorPage() {
  const [config, setConfig] = useState({
    campaign: 'test',
    limit: 3,
    sort: 'newest',
    theme: 'light' as Theme,
    title: 'Kundenbewertungen',
    showRating: true,
    animation: true,
  })

  const [previewDevice, setPreviewDevice] = useState<Device>('desktop')
  const [copied, setCopied] = useState<string | null>(null)
  const [iframeKey, setIframeKey] = useState(0)

  // Reload iFrame wenn Config ändert
  useEffect(() => {
    setIframeKey((prev) => prev + 1)
  }, [config])

  const scriptCode = `<!-- Kundenmagnet Widget -->
<div
  data-kundenmagnet-widget
  data-campaign="${config.campaign}"
  data-limit="${config.limit}"
  data-sort="${config.sort}"
  data-theme="${config.theme}"
  data-title="${config.title}"
  data-show-rating="${config.showRating}"
  data-animation="${config.animation}"
></div>
<script src="https://kundenmagnet-app.de/widget.js" async></script>`

  const iframeCode = `<!-- Kundenmagnet Widget (iFrame) -->
<iframe
  src="https://kundenmagnet-app.de/widget/frame?campaign=${config.campaign}&limit=${config.limit}&sort=${config.sort}&theme=${config.theme}"
  style="width: 100%; border: none; min-height: 400px;"
  title="${config.title}"
></iframe>`

  const copyToClipboard = async (code: string, type: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(type)
      toast.success('Code kopiert!')
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      toast.error('Kopieren fehlgeschlagen')
    }
  }

  const deviceWidth = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  }

  const themeButtons: { value: Theme; label: string }[] = [
    { value: 'light', label: 'Hell' },
    { value: 'dark', label: 'Dunkel' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'colorful', label: 'Bunt' },
  ]

  const deviceButtons: { value: Device; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
    { value: 'desktop', icon: Monitor, label: 'Desktop' },
    { value: 'tablet', icon: Tablet, label: 'Tablet' },
    { value: 'mobile', icon: Smartphone, label: 'Mobile' },
  ]

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold">So sieht Ihr Widget aus</h1>
        <p className="text-lg text-gray-600">
          Vollständig anpassbar an Ihr Design - fertig in 30 Sekunden
        </p>
      </div>

      {/* Vorschau & Code */}
      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="mx-auto grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="preview">Vorschau</TabsTrigger>
          <TabsTrigger value="code">Code einbinden</TabsTrigger>
        </TabsList>

        {/* VORSCHAU TAB */}
        <TabsContent value="preview" className="mt-8 space-y-6">
          {/* Theme & Device Controls */}
          <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
            {/* Theme Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Theme:</span>
              <div className="flex gap-2">
                {themeButtons.map((theme) => (
                  <Button
                    key={theme.value}
                    size="sm"
                    variant={config.theme === theme.value ? 'default' : 'outline'}
                    onClick={() => setConfig({ ...config, theme: theme.value })}
                  >
                    {theme.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Device Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Gerät:</span>
              <div className="flex gap-2">
                {deviceButtons.map((device) => (
                  <Button
                    key={device.value}
                    size="sm"
                    variant={previewDevice === device.value ? 'default' : 'outline'}
                    onClick={() => setPreviewDevice(device.value)}
                  >
                    <device.icon className="h-4 w-4" />
                    <span className="ml-2 hidden sm:inline">{device.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Neue Bewertungen Button */}
            <Button size="sm" variant="ghost" onClick={() => setIframeKey((prev) => prev + 1)}>
              🔄 Neue Bewertungen
            </Button>
          </div>

          {/* Widget Preview */}
          <Card className="overflow-hidden bg-gray-50 p-8">
            <div
              className="mx-auto transition-all"
              style={{ maxWidth: deviceWidth[previewDevice] }}
            >
              <div className="rounded-lg bg-white p-4 shadow-lg">
                <iframe
                  key={iframeKey}
                  src={`/widget/frame?campaign=${config.campaign}&limit=${config.limit}&sort=${config.sort}&theme=${config.theme}`}
                  style={{
                    width: '100%',
                    border: 'none',
                    minHeight: '500px',
                    display: 'block',
                  }}
                  title="Widget Vorschau"
                />
              </div>
            </div>
          </Card>

          {/* Unter Vorschau - Hinweise */}
          <div className="mx-auto max-w-4xl">
            <h3 className="mb-4 text-center text-xl font-semibold">Das sagen unsere Kunden</h3>
            <p className="mb-6 text-center text-gray-600">
              Über 500+ zufriedene Kunden vertrauen uns
            </p>

            {/* Demo Testimonials (statisch für Marketing) */}
            <div className="grid gap-4 md:grid-cols-3">
              {DEMO_TESTIMONIALS.map((testimonial) => (
                <Card key={testimonial.id} className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold">{testimonial.name}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400">
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                  {testimonial.company && (
                    <p className="mb-2 text-sm text-gray-600">{testimonial.company}</p>
                  )}
                  <p className="text-sm text-gray-700">{testimonial.text}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    {testimonial.verified && (
                      <span className="flex items-center gap-1">
                        <Check className="h-3 w-3 text-blue-600" />
                        Verifiziert
                      </span>
                    )}
                    <span>{testimonial.date}</span>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button size="lg" asChild>
                <a href="#code">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Alle Bewertungen ansehen
                </a>
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* CODE TAB */}
        <TabsContent value="code" className="mt-8">
          <div className="mx-auto max-w-5xl">
            <Card className="p-6">
              <h2 className="mb-6 text-2xl font-semibold">In 3 Schritten eingebunden:</h2>

              <ol className="mb-8 space-y-3 text-gray-700">
                <li>1. Kopieren Sie den Code unten</li>
                <li>2. Fügen Sie ihn an der gewünschten Stelle auf Ihrer Website ein</li>
                <li>3. Fertig! Das Widget lädt automatisch Ihre Bewertungen</li>
              </ol>

              {/* Konfigurator */}
              <div className="mb-8 grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="campaign">Kampagnen-Slug *</Label>
                    <Input
                      id="campaign"
                      value={config.campaign}
                      onChange={(e) => setConfig({ ...config, campaign: e.target.value })}
                      placeholder="test"
                      className="mt-2"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Der Slug Ihrer Kampagne (aus dem Dashboard)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="title">Widget-Titel</Label>
                    <Input
                      id="title"
                      value={config.title}
                      onChange={(e) => setConfig({ ...config, title: e.target.value })}
                      placeholder="Kundenbewertungen"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="limit">Anzahl Bewertungen</Label>
                    <Input
                      id="limit"
                      type="number"
                      min="1"
                      max="50"
                      value={config.limit}
                      onChange={(e) =>
                        setConfig({ ...config, limit: parseInt(e.target.value) || 10 })
                      }
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Sortierung</Label>
                    <RadioGroup
                      value={config.sort}
                      onValueChange={(value: string) => setConfig({ ...config, sort: value })}
                      className="mt-2 space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="newest" id="newest" />
                        <Label htmlFor="newest" className="font-normal">
                          Neueste zuerst
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="oldest" id="oldest" />
                        <Label htmlFor="oldest" className="font-normal">
                          Älteste zuerst
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="highest" id="highest" />
                        <Label htmlFor="highest" className="font-normal">
                          Beste Bewertung zuerst
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>Theme</Label>
                    <RadioGroup
                      value={config.theme}
                      onValueChange={(value: Theme) => setConfig({ ...config, theme: value })}
                      className="mt-2 space-y-2"
                    >
                      {themeButtons.map((theme) => (
                        <div key={theme.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={theme.value} id={`theme-${theme.value}`} />
                          <Label htmlFor={`theme-${theme.value}`} className="font-normal">
                            {theme.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="showRating">Sterne anzeigen</Label>
                    <Switch
                      id="showRating"
                      checked={config.showRating}
                      onCheckedChange={(checked: boolean) =>
                        setConfig({ ...config, showRating: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="animation">Animationen</Label>
                    <Switch
                      id="animation"
                      checked={config.animation}
                      onCheckedChange={(checked: boolean) =>
                        setConfig({ ...config, animation: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Code Output */}
              <Tabs defaultValue="javascript" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="iframe">iFrame</TabsTrigger>
                </TabsList>

                <TabsContent value="javascript" className="space-y-4">
                  <div className="rounded-lg bg-gray-900 p-4">
                    <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-gray-100">
                      <code>{scriptCode}</code>
                    </pre>
                  </div>

                  <Button
                    onClick={() => copyToClipboard(scriptCode, 'script')}
                    className="w-full"
                    size="lg"
                  >
                    {copied === 'script' ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Kopiert!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Code kopieren
                      </>
                    )}
                  </Button>

                  <div className="rounded-lg bg-blue-50 p-4 text-sm">
                    <p className="mb-2 font-medium text-blue-900">💡 Tipp:</p>
                    <p className="text-blue-700">
                      Das Widget passt sich automatisch an die Breite des Container-Elements an. Sie
                      können weitere Optionen wie data-columns=&quot;2&quot; oder data-show-rating=&quot;false&quot;
                      hinzufügen.
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="font-medium">🎨 Anpassungsoptionen</p>
                    <ul className="list-inside list-disc space-y-1">
                      <li>data-theme: light, dark, minimal, colorful</li>
                      <li>data-limit: Anzahl der Bewertungen (1-50)</li>
                      <li>data-columns: Spaltenanzahl (1-4)</li>
                      <li>data-show-rating: true/false</li>
                      <li>data-verified-only: true/false</li>
                    </ul>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="font-medium">📊 Performance</p>
                    <ul className="list-inside list-disc space-y-1">
                      <li>Lädt asynchron (blockiert nicht)</li>
                      <li>Gzip-komprimiert (~8KB)</li>
                      <li>CDN mit Standorten in EU</li>
                      <li>Caching für schnelle Ladezeiten</li>
                      <li>Funktioniert ohne jQuery</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="iframe" className="space-y-4">
                  <div className="rounded-lg bg-gray-900 p-4">
                    <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-gray-100">
                      <code>{iframeCode}</code>
                    </pre>
                  </div>

                  <Button
                    onClick={() => copyToClipboard(iframeCode, 'iframe')}
                    className="w-full"
                    size="lg"
                  >
                    {copied === 'iframe' ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Kopiert!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Code kopieren
                      </>
                    )}
                  </Button>

                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="font-medium">Hinweise:</p>
                    <ul className="list-inside list-disc space-y-1">
                      <li>Fallback für restriktive Umgebungen</li>
                      <li>Keine JavaScript-Abhängigkeit</li>
                      <li>Automatische Höhenanpassung</li>
                      <li>CSP-kompatibel</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-8 border-t pt-6">
                <h3 className="mb-4 font-semibold">Widget testen</h3>
                <p className="mb-4 text-sm text-gray-600">
                  Testen Sie das Widget in Echtzeit auf einer Test-Seite oder direkt im iFrame.
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" asChild className="flex-1">
                    <a
                      href={`/widget/frame?campaign=${config.campaign}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      iFrame-Vorschau öffnen
                    </a>
                  </Button>
                  <Button variant="outline" asChild className="flex-1">
                    <a href="/docs/widget" target="_blank">
                      📖 Zur Dokumentation
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer Section */}
      <div className="mt-16 border-t pt-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-2xl font-bold">Sicherheit & Datenschutz an erster Stelle</h2>
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="p-4">
              <div className="mb-2 text-3xl">✅</div>
              <h3 className="font-semibold">14 Tage kostenlos</h3>
              <p className="text-sm text-gray-600">Garantiert</p>
            </Card>
            <Card className="p-4">
              <div className="mb-2 text-3xl">🔒</div>
              <h3 className="font-semibold">DSGVO-konform</h3>
              <p className="text-sm text-gray-600">Garantiert</p>
            </Card>
            <Card className="p-4">
              <div className="mb-2 text-3xl">🇪🇺</div>
              <h3 className="font-semibold">500+ Kunden</h3>
              <p className="text-sm text-gray-600">Garantiert</p>
            </Card>
            <Card className="p-4">
              <div className="mb-2 text-3xl">💬</div>
              <h3 className="font-semibold">Support 24/7</h3>
              <p className="text-sm text-gray-600">Garantiert</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
