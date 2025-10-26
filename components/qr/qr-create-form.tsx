// components/qr/qr-create-form.tsx
// 📝 Formular zum Erstellen eines QR-Codes
// 🔐 DSGVO: Nutzer wählt eigene Kampagne

'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createQRCodeSchema } from '@/lib/validations/qr'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Campaign {
  id: string
  name: string
  slug: string
}

interface QRCreateFormProps {
  campaigns: Campaign[]
}

export function QRCreateForm({ campaigns }: QRCreateFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    campaign_id: '',
    title: '',
    design: {
      color: '#000000',
      background: '#FFFFFF',
      errorCorrectionLevel: 'H' as 'L' | 'M' | 'Q' | 'H',
      margin: 4,
      size: 1024,
    },
    utm_source: 'qr',
    utm_medium: 'offline',
    utm_campaign: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validierung
      const parsed = createQRCodeSchema.safeParse(formData)
      if (!parsed.success) {
        setError(parsed.error.errors[0].message)
        setLoading(false)
        return
      }

      // API-Aufruf
      const response = await fetch('/api/qr/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Erstellen des QR-Codes')
      }

      // Erfolg - zur Übersicht-Seite
      router.push('/app/qr')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Neuer QR-Code</CardTitle>
          <CardDescription>Erstellen Sie einen QR-Code für eine Ihrer Kampagnen</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">{error}</div>}

          {/* Kampagnen-Auswahl */}
          <div className="space-y-2">
            <Label htmlFor="campaign">Kampagne *</Label>
            <Select
              value={formData.campaign_id}
              onValueChange={(value: string) => setFormData({ ...formData, campaign_id: value })}
              required
            >
              <SelectTrigger id="campaign">
                <SelectValue placeholder="Kampagne auswählen..." />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Der QR-Code leitet zu dieser Kampagne weiter</p>
          </div>

          {/* Titel */}
          <div className="space-y-2">
            <Label htmlFor="title">Titel *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="z.B. Kassenbon QR-Code"
              required
              maxLength={100}
            />
            <p className="text-xs text-gray-500">
              Interner Name zur Identifikation (max. 100 Zeichen)
            </p>
          </div>

          {/* Design-Optionen */}
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="text-sm font-semibold">Design-Optionen</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="color">Farbe</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={formData.design.color}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        design: { ...formData.design, color: e.target.value },
                      })
                    }
                    className="h-10 w-20"
                  />
                  <Input
                    type="text"
                    value={formData.design.color}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        design: { ...formData.design, color: e.target.value },
                      })
                    }
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="background">Hintergrund</Label>
                <div className="flex gap-2">
                  <Input
                    id="background"
                    type="color"
                    value={formData.design.background}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        design: { ...formData.design, background: e.target.value },
                      })
                    }
                    className="h-10 w-20"
                  />
                  <Input
                    type="text"
                    value={formData.design.background}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        design: { ...formData.design, background: e.target.value },
                      })
                    }
                    placeholder="#FFFFFF"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="errorCorrection">Fehlerkorrektur</Label>
              <Select
                value={formData.design.errorCorrectionLevel}
                onValueChange={(value: 'L' | 'M' | 'Q' | 'H') =>
                  setFormData({
                    ...formData,
                    design: { ...formData.design, errorCorrectionLevel: value },
                  })
                }
              >
                <SelectTrigger id="errorCorrection">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Niedrig (L)</SelectItem>
                  <SelectItem value="M">Mittel (M)</SelectItem>
                  <SelectItem value="Q">Hoch (Q)</SelectItem>
                  <SelectItem value="H">Sehr hoch (H) - Empfohlen</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Höhere Stufen ermöglichen bessere Lesbarkeit bei Beschädigungen
              </p>
            </div>
          </div>

          {/* UTM-Parameter */}
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="text-sm font-semibold">UTM-Tracking (Optional)</h3>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="utm_source">UTM Source</Label>
                <Input
                  id="utm_source"
                  value={formData.utm_source}
                  onChange={(e) => setFormData({ ...formData, utm_source: e.target.value })}
                  placeholder="qr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="utm_medium">UTM Medium</Label>
                <Input
                  id="utm_medium"
                  value={formData.utm_medium}
                  onChange={(e) => setFormData({ ...formData, utm_medium: e.target.value })}
                  placeholder="offline"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="utm_campaign">UTM Campaign</Label>
                <Input
                  id="utm_campaign"
                  value={formData.utm_campaign}
                  onChange={(e) => setFormData({ ...formData, utm_campaign: e.target.value })}
                  placeholder="optional"
                />
              </div>
            </div>

            <p className="text-xs text-gray-500">
              UTM-Parameter helfen bei der Analyse der Traffic-Quellen
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Abbrechen
          </Button>
          <Button type="submit" disabled={loading || !formData.campaign_id || !formData.title}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            QR-Code erstellen
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
