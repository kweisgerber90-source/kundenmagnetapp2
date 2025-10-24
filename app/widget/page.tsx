// /app/widget/page.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Check, Copy, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function WidgetConfiguratorPage() {
  const [config, setConfig] = useState({
    campaign: 'mein-shop',
    limit: 10,
    sort: 'newest',
    theme: 'light',
    title: 'Kundenbewertungen',
    showRating: true,
    animation: true,
  })

  const [copied, setCopied] = useState<string | null>(null)

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

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Widget-Konfigurator</h1>
        <p className="text-gray-600">
          Konfigurieren Sie Ihr Bewertungs-Widget und kopieren Sie den Code
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Konfigurator */}
        <Card className="p-6">
          <h2 className="mb-6 text-xl font-semibold">Einstellungen</h2>

          <div className="space-y-6">
            <div>
              <Label htmlFor="campaign">Kampagnen-Slug *</Label>
              <Input
                id="campaign"
                value={config.campaign}
                onChange={(e) => setConfig({ ...config, campaign: e.target.value })}
                placeholder="mein-shop"
                className="mt-1"
              />
              <p className="mt-1 text-sm text-gray-500">
                Der Slug Ihrer Kampagne (aus dem Dashboard)
              </p>
            </div>

            <div>
              <Label htmlFor="title">Widget-Titel</Label>
              <Input
                id="title"
                value={config.title}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                className="mt-1"
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
                onChange={(e) => setConfig({ ...config, limit: parseInt(e.target.value) || 10 })}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Sortierung</Label>
              <RadioGroup
                value={config.sort}
                onValueChange={(value: string) => setConfig({ ...config, sort: value })}
                className="mt-2"
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
                  <RadioGroupItem value="rating" id="rating" />
                  <Label htmlFor="rating" className="font-normal">
                    Beste Bewertung zuerst
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Theme</Label>
              <RadioGroup
                value={config.theme}
                onValueChange={(value: string) => setConfig({ ...config, theme: value })}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="font-normal">
                    Hell
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark" className="font-normal">
                    Dunkel
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="auto" id="auto" />
                  <Label htmlFor="auto" className="font-normal">
                    Automatisch
                  </Label>
                </div>
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
                onCheckedChange={(checked: boolean) => setConfig({ ...config, animation: checked })}
              />
            </div>
          </div>
        </Card>

        {/* Code-Output */}
        <Card className="p-6">
          <h2 className="mb-6 text-xl font-semibold">Einbettungscode</h2>

          <Tabs defaultValue="script" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="script">JavaScript</TabsTrigger>
              <TabsTrigger value="iframe">iFrame</TabsTrigger>
            </TabsList>

            <TabsContent value="script" className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                <pre className="overflow-x-auto whitespace-pre-wrap text-sm">
                  <code>{scriptCode}</code>
                </pre>
              </div>

              <Button
                onClick={() => copyToClipboard(scriptCode, 'script')}
                className="w-full"
                variant="outline"
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

              <div className="space-y-2 text-sm text-gray-600">
                <p className="font-medium">Vorteile:</p>
                <ul className="list-inside list-disc space-y-1">
                  <li>Shadow DOM isoliert Styles</li>
                  <li>Automatisches Caching</li>
                  <li>Optimale Performance</li>
                  <li>Responsive Design</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="iframe" className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                <pre className="overflow-x-auto whitespace-pre-wrap text-sm">
                  <code>{iframeCode}</code>
                </pre>
              </div>

              <Button
                onClick={() => copyToClipboard(iframeCode, 'iframe')}
                className="w-full"
                variant="outline"
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

          <div className="mt-6 border-t pt-6">
            <Button variant="outline" className="w-full" asChild>
              <a href="/docs/widget" target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                Zur Dokumentation
              </a>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
