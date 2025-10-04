// components/widget-preview.tsx
'use client'

import { TestimonialCard } from '@/components/testimonial-card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SAMPLE_TESTIMONIALS, WIDGET_THEMES } from '@/lib/sample-data'
import { Check, Copy, Monitor, Shuffle, Smartphone, Tablet } from 'lucide-react'
import { useState } from 'react'

export function WidgetPreview() {
  const [theme, setTheme] = useState<keyof typeof WIDGET_THEMES>('light')
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [copied, setCopied] = useState(false)
  const [testimonials, setTestimonials] = useState(SAMPLE_TESTIMONIALS.slice(0, 3))

  const embedCode = `<!-- Kundenmagnetapp Widget -->
<div id="kundenmagnet-widget" 
     data-campaign="ihre-kampagne" 
     data-theme="${theme}"
     data-limit="3">
</div>
<script src="https://kundenmagnet-app.de/widget.js" async></script>`

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shuffleTestimonials = () => {
    const shuffled = [...SAMPLE_TESTIMONIALS].sort(() => Math.random() - 0.5)
    setTestimonials(shuffled.slice(0, 3))
  }

  const deviceWidths = {
    desktop: 'max-w-6xl',
    tablet: 'max-w-2xl',
    mobile: 'max-w-sm',
  }

  const currentTheme = WIDGET_THEMES[theme]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="mb-2 text-3xl font-bold">So sieht Ihr Widget aus</h2>
        <p className="text-lg text-muted-foreground">
          Vollständig anpassbar an Ihr Design - fertig in 30 Sekunden
        </p>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Vorschau</TabsTrigger>
          <TabsTrigger value="code">Code einbinden</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Theme:</span>
              <div className="flex gap-1">
                {Object.entries(WIDGET_THEMES).map(([key, value]) => (
                  <Button
                    key={key}
                    size="sm"
                    variant={theme === key ? 'default' : 'outline'}
                    onClick={() => setTheme(key as keyof typeof WIDGET_THEMES)}
                  >
                    {value.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Gerät:</span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={device === 'desktop' ? 'default' : 'outline'}
                  onClick={() => setDevice('desktop')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={device === 'tablet' ? 'default' : 'outline'}
                  onClick={() => setDevice('tablet')}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={device === 'mobile' ? 'default' : 'outline'}
                  onClick={() => setDevice('mobile')}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button size="sm" variant="ghost" onClick={shuffleTestimonials}>
              <Shuffle className="mr-2 h-4 w-4" />
              Neue Bewertungen
            </Button>
          </div>

          {/* Preview Container */}
          <div className="flex justify-center">
            <div
              className={`w-full transition-all ${deviceWidths[device]}`}
              style={{
                background:
                  typeof currentTheme.background === 'string' &&
                  currentTheme.background.includes('gradient')
                    ? currentTheme.background
                    : currentTheme.background,
                padding: '2rem',
                borderRadius: '0.5rem',
                border: `1px solid ${currentTheme.border}`,
              }}
            >
              <div className="mb-6 text-center" style={{ color: currentTheme.text }}>
                <h3 className="text-2xl font-bold">Das sagen unsere Kunden</h3>
                <p className="mt-2 opacity-80">Über 500+ zufriedene Kunden vertrauen uns</p>
              </div>

              <div
                className={`grid gap-4 ${device === 'mobile' ? 'grid-cols-1' : device === 'tablet' ? 'grid-cols-2' : 'grid-cols-3'}`}
              >
                {testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} {...testimonial} theme={theme} />
                ))}
              </div>

              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  style={{
                    borderColor: currentTheme.accent,
                    color: currentTheme.accent,
                  }}
                >
                  Alle Bewertungen ansehen
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">In 3 Schritten eingebunden:</h3>
              <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                <li>Kopieren Sie den Code unten</li>
                <li>Fügen Sie ihn an der gewünschten Stelle auf Ihrer Website ein</li>
                <li>Fertig! Das Widget lädt automatisch Ihre Bewertungen</li>
              </ol>
            </div>

            <div className="relative">
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                <code>{embedCode}</code>
              </pre>
              <Button size="sm" className="absolute right-2 top-2" onClick={handleCopyCode}>
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Kopiert!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Kopieren
                  </>
                )}
              </Button>
            </div>

            <div className="mt-4 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-900">💡 Tipp:</p>
              <p className="mt-1 text-sm text-blue-800">
                Das Widget passt sich automatisch an die Breite des Container-Elements an. Sie
                können weitere Optionen wie data-columns=&quot;2&quot; oder
                data-show-rating=&quot;false&quot; hinzufügen.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-semibold">🎨 Anpassungsoptionen</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• data-theme: light, dark, minimal, colorful</li>
                <li>• data-limit: Anzahl der Bewertungen (1-50)</li>
                <li>• data-columns: Spaltenanzahl (1-4)</li>
                <li>• data-show-rating: true/false</li>
                <li>• data-verified-only: true/false</li>
              </ul>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-semibold">🚀 Performance</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Lädt asynchron (blockiert nicht)</li>
                <li>• Gzip-komprimiert (~8KB)</li>
                <li>• CDN mit Standorten in EU</li>
                <li>• Caching für schnelle Ladezeiten</li>
                <li>• Funktioniert ohne jQuery</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
