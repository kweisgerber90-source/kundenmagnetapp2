// /app/app/widget/page.tsx
// Widget-Konfigurator mit Kampagnen-Dropdown
'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle, Check, Code2, Copy, ExternalLink, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Campaign {
  id: string
  name: string
  slug: string
  status: string
}

export default function WidgetConfiguratorPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [config, setConfig] = useState({
    campaign: '',
    limit: 10,
    sort: 'newest',
    theme: 'light',
    title: 'Kundenbewertungen',
    showRating: true,
    animation: true,
  })

  const [copied, setCopied] = useState<string | null>(null)

  // Kampagnen laden
  useEffect(() => {
    async function loadCampaigns() {
      try {
        setLoading(true)
        setError(null)

        const supabase = createClient()

        const { data, error: fetchError } = await supabase
          .from('campaigns')
          .select('id, name, slug, status')
          .eq('status', 'active')
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError

        setCampaigns(data || [])

        // Automatisch erste Kampagne auswählen
        if (data && data.length > 0) {
          setConfig((prev) => ({ ...prev, campaign: data[0].slug }))
        }
      } catch (err) {
        console.error('Error loading campaigns:', err)
        setError('Kampagnen konnten nicht geladen werden')
      } finally {
        setLoading(false)
      }
    }

    loadCampaigns()
  }, [])

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
            {/* Kampagnen-Dropdown */}
            <div>
              <Label htmlFor="campaign">Kampagne auswählen *</Label>
              {loading ? (
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Kampagnen werden geladen...
                </div>
              ) : error ? (
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              ) : campaigns.length === 0 ? (
                <div className="mt-2 rounded-lg border border-orange-200 bg-orange-50 p-4">
                  <p className="text-sm font-medium text-orange-900">
                    Noch keine Kampagnen vorhanden
                  </p>
                  <p className="mt-1 text-xs text-orange-700">
                    Erstellen Sie zuerst eine Kampagne, um das Widget zu konfigurieren
                  </p>
                  <Button asChild className="mt-3" size="sm" variant="outline">
                    <a href="/app/kampagnen">
                      <Code2 className="mr-2 h-4 w-4" />
                      Kampagne erstellen
                    </a>
                  </Button>
                </div>
              ) : (
                <>
                  <Select
                    value={config.campaign}
                    onValueChange={(v) => setConfig({ ...config, campaign: v })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Kampagne wählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      {campaigns.map((campaign) => (
                        <SelectItem key={campaign.id} value={campaign.slug}>
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-medium">{campaign.name}</span>
                            <code className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                              {campaign.slug}
                            </code>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="mt-1 text-sm text-gray-500">
                    Wählen Sie die Kampagne aus, deren Bewertungen angezeigt werden sollen
                  </p>
                </>
              )}
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

          {!config.campaign ? (
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-6 text-center">
              <p className="text-sm font-medium text-orange-900">
                Bitte wählen Sie zuerst eine Kampagne aus
              </p>
            </div>
          ) : (
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
                  disabled={!config.campaign}
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
                  disabled={!config.campaign}
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
          )}

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

      {/* Widget Testen */}
      {config.campaign && (
        <div className="mt-8">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Widget testen</h3>
            <p className="mb-4 text-sm text-gray-600">
              Testen Sie das Widget in Echtzeit auf einer Test-Seite oder direkt im iFrame.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" asChild>
                <a
                  href={`/widget/frame?campaign=${config.campaign}&limit=${config.limit}&sort=${config.sort}&theme=${config.theme}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  iFrame-Vorschau öffnen
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/docs/widget" target="_blank">
                  📖 Dokumentation ansehen
                </a>
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
