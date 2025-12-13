// app/app/qr/new/page.tsx
'use client'

import { useLimitDialog } from '@/components/billing/limit-reached-dialog' // 🔧 Korrektur: Limit-Dialog bei LIMIT_EXCEEDED
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Campaign {
  id: string
  name: string
  slug: string
}

export default function NewQRPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const { show: showLimitDialog } = useLimitDialog()

  const [formData, setFormData] = useState({
    campaign_id: '',
    title: '',
    color: '#000000',
    background: '#FFFFFF',
  })

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, name, slug')
        .eq('status', 'active')
        .order('name')

      if (error) {
        console.error('Fehler beim Laden der Kampagnen:', error)
        return
      }

      setCampaigns(data || [])
    } catch (err) {
      console.error('Fehler:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.campaign_id || !formData.title) {
      alert('Bitte füllen Sie alle Pflichtfelder aus')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/qr/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_id: formData.campaign_id,
          title: formData.title,
          design: {
            color: formData.color,
            background: formData.background,
          },
        }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as {
          error?: string
          code?: string
          current?: number
          limit?: number
          planId?: string
        }

        // 🔧 Korrektur: QR-Code Limit sauber behandeln (statt generischer Alert)
        if (payload.code === 'LIMIT_EXCEEDED') {
          showLimitDialog({
            limitType: 'qr_codes',
            current: typeof payload.current === 'number' ? payload.current : 0,
            limit: typeof payload.limit === 'number' ? payload.limit : 0,
            currentPlan: payload.planId || 'starter',
          })
          return
        }

        throw new Error(payload.error ?? 'QR-Code konnte nicht erstellt werden')
      }

      const data = await response.json()
      router.push(`/app/qr/${data.id}`)
    } catch (err) {
      console.error('Fehler beim Erstellen:', err)
      alert(err instanceof Error ? err.message : 'Fehler beim Erstellen des QR-Codes')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/app/qr">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur Übersicht
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Neuer QR-Code</h1>
        <p className="mt-2 text-gray-600">
          Erstellen Sie einen QR-Code für Ihre Bewertungskampagne.
        </p>
      </div>

      {/* Formular */}
      <Card>
        <CardHeader>
          <CardTitle>QR-Code Einstellungen</CardTitle>
          <CardDescription>Wählen Sie eine Kampagne und passen Sie das Design an.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Kampagne */}
            <div className="space-y-2">
              <Label htmlFor="campaign">Kampagne *</Label>
              <Select
                value={formData.campaign_id}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, campaign_id: value }))}
              >
                <SelectTrigger id="campaign">
                  <SelectValue placeholder="Wählen Sie eine Kampagne" />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <div className="p-4 text-center text-sm text-gray-500">Lädt...</div>
                  ) : campaigns.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      Keine Kampagnen vorhanden
                    </div>
                  ) : (
                    campaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {campaigns.length === 0 && !loading && (
                <p className="text-sm text-gray-500">
                  <Link href="/app/kampagnen" className="text-blue-600 hover:underline">
                    Erstellen Sie zuerst eine Kampagne
                  </Link>
                </p>
              )}
            </div>

            {/* Titel */}
            <div className="space-y-2">
              <Label htmlFor="title">Titel *</Label>
              <Input
                id="title"
                placeholder="z.B. Kassenbereich, Tisch 5, Eingang"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
              <p className="text-sm text-gray-500">
                Geben Sie einen Namen ein, um den QR-Code später zu identifizieren.
              </p>
            </div>

            {/* Farbe */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">QR-Code Farbe</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                    className="h-10 w-20"
                  />
                  <Input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="background">Hintergrundfarbe</Label>
                <div className="flex gap-2">
                  <Input
                    id="background"
                    type="color"
                    value={formData.background}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, background: e.target.value }))
                    }
                    className="h-10 w-20"
                  />
                  <Input
                    type="text"
                    value={formData.background}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, background: e.target.value }))
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Vorschau */}
            <div className="rounded-lg border bg-gray-50 p-6">
              <h4 className="mb-4 text-sm font-medium text-gray-700">Vorschau</h4>
              <div
                className="mx-auto flex h-48 w-48 items-center justify-center rounded-lg"
                style={{ backgroundColor: formData.background }}
              >
                <div
                  className="h-32 w-32 rounded"
                  style={{ backgroundColor: formData.color, opacity: 0.8 }}
                />
              </div>
              <p className="mt-4 text-center text-sm text-gray-500">
                Vorschau wird nach Erstellung angezeigt
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={submitting || campaigns.length === 0}
                className="flex-1"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Erstelle...
                  </>
                ) : (
                  'QR-Code erstellen'
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/app/qr">Abbrechen</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
