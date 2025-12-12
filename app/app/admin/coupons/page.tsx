// /app/app/admin/coupons/page.tsx
/**
 * 🎫 Admin: Coupon Management
 * Seite zum Erstellen und Verwalten von Coupons/Promotion Codes
 */

'use client'

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
import { AlertCircle, CheckCircle2, Euro, Loader2, Percent, Ticket } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

type Coupon = {
  id: string
  code: string
  promoCode: string | null
  type: 'percent' | 'amount'
  value: number
  duration: string
  durationInMonths?: number
  timesRedeemed: number
  maxRedemptions?: number
  valid: boolean
  created: string
  expiresAt: string | null
}

export default function CouponsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingList, setIsFetchingList] = useState(false)
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Form State
  const [code, setCode] = useState('')
  const [type, setType] = useState<'percent' | 'amount'>('percent')
  const [value, setValue] = useState('10')
  const [duration, setDuration] = useState<'once' | 'repeating' | 'forever'>('once')
  const [durationInMonths, setDurationInMonths] = useState('3')
  const [maxRedemptions, setMaxRedemptions] = useState('')
  const [expiresAt, setExpiresAt] = useState('')

  // Lade Coupons
  const fetchCoupons = useCallback(async () => {
    setIsFetchingList(true)
    try {
      const response = await fetch('/api/admin/coupons')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Laden')
      }

      setCoupons(data.coupons || [])
    } catch (error) {
      // Inline alert statt showAlert um dependency zu vermeiden
      const message = error instanceof Error ? error.message : 'Fehler beim Laden der Liste'
      setAlert({ type: 'error', message })
      setTimeout(() => setAlert(null), 5000)
    } finally {
      setIsFetchingList(false)
    }
  }, []) // ← Keine dependencies mehr nötig

  useEffect(() => {
    void fetchCoupons()
  }, [fetchCoupons])

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 5000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.toUpperCase(),
          type,
          value: parseFloat(value),
          duration,
          durationInMonths: duration === 'repeating' ? parseInt(durationInMonths, 10) : undefined,
          maxRedemptions: maxRedemptions ? parseInt(maxRedemptions, 10) : undefined,
          expiresAt: expiresAt || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Erstellen')
      }

      showAlert('success', `Coupon ${code} erfolgreich erstellt!`)

      // Formular zurücksetzen
      setCode('')
      setValue('10')
      setMaxRedemptions('')
      setExpiresAt('')

      // Liste neu laden
      await fetchCoupons()
    } catch (error) {
      showAlert('error', error instanceof Error ? error.message : 'Fehler beim Erstellen')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">🎫 Coupon Management</h1>
        <p className="text-muted-foreground">Erstelle und verwalte Rabatt-Codes</p>
      </div>

      {/* Alert */}
      {alert && (
        <div
          className={`rounded-lg border p-4 ${
            alert.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {alert.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{alert.message}</span>
          </div>
        </div>
      )}

      {/* Formular */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Neuen Coupon erstellen
          </CardTitle>
          <CardDescription>
            Coupons können bei der Registrierung oder im Checkout verwendet werden
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Coupon Code */}
              <div className="space-y-2">
                <Label htmlFor="code">Coupon-Code *</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="SOMMER2024"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  disabled={isLoading}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">Nur Großbuchstaben, Zahlen, - und _</p>
              </div>

              {/* Typ */}
              <div className="space-y-2">
                <Label htmlFor="type">Rabatt-Typ *</Label>
                <Select value={type} onValueChange={(v) => setType(v as 'percent' | 'amount')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4" />
                        Prozent (%)
                      </div>
                    </SelectItem>
                    <SelectItem value="amount">
                      <div className="flex items-center gap-2">
                        <Euro className="h-4 w-4" />
                        Betrag (€)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Wert */}
              <div className="space-y-2">
                <Label htmlFor="value">Rabatt-Wert * {type === 'percent' ? '(%)' : '(€)'}</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={type === 'percent' ? '100' : undefined}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  {type === 'percent' ? 'z.B. 10 für 10%' : 'z.B. 5.00 für 5€'}
                </p>
              </div>

              {/* Dauer */}
              <div className="space-y-2">
                <Label htmlFor="duration">Gültigkeit *</Label>
                <Select
                  value={duration}
                  onValueChange={(v) => setDuration(v as 'once' | 'repeating' | 'forever')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Einmalig (erste Rechnung)</SelectItem>
                    <SelectItem value="repeating">Mehrere Monate</SelectItem>
                    <SelectItem value="forever">Für immer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Monate (nur bei repeating) */}
              {duration === 'repeating' && (
                <div className="space-y-2">
                  <Label htmlFor="durationInMonths">Anzahl Monate *</Label>
                  <Input
                    id="durationInMonths"
                    type="number"
                    min="1"
                    max="36"
                    value={durationInMonths}
                    onChange={(e) => setDurationInMonths(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              )}

              {/* Max Einlösungen */}
              <div className="space-y-2">
                <Label htmlFor="maxRedemptions">Max. Einlösungen (optional)</Label>
                <Input
                  id="maxRedemptions"
                  type="number"
                  min="1"
                  placeholder="Unbegrenzt"
                  value={maxRedemptions}
                  onChange={(e) => setMaxRedemptions(e.target.value)}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Leer lassen für unbegrenzte Verwendung
                </p>
              </div>

              {/* Ablaufdatum */}
              <div className="space-y-2">
                <Label htmlFor="expiresAt">Ablaufdatum (optional)</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird erstellt...
                </>
              ) : (
                <>
                  <Ticket className="mr-2 h-4 w-4" />
                  Coupon erstellen
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Liste */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Aktive Coupons</CardTitle>
              <CardDescription>Alle erstellten Rabatt-Codes</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchCoupons} disabled={isFetchingList}>
              {isFetchingList ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Aktualisieren'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isFetchingList ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : coupons.length === 0 ? (
            <div className="rounded-lg border border-dashed py-8 text-center">
              <AlertCircle className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">Keine Coupons vorhanden</p>
            </div>
          ) : (
            <div className="space-y-4">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="flex items-start justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-blue-500" />
                      <p className="font-mono font-bold">{coupon.code}</p>
                      {!coupon.valid && (
                        <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">
                          Abgelaufen
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {coupon.type === 'percent'
                        ? `${coupon.value}% Rabatt`
                        : `${coupon.value}€ Rabatt`}
                      {' · '}
                      {coupon.duration === 'once' && 'Einmalig'}
                      {coupon.duration === 'repeating' && `${coupon.durationInMonths} Monate`}
                      {coupon.duration === 'forever' && 'Für immer'}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="rounded bg-blue-100 px-2 py-1 text-blue-700">
                        {coupon.timesRedeemed}x verwendet
                        {coupon.maxRedemptions && ` / ${coupon.maxRedemptions} max`}
                      </span>
                      {coupon.promoCode && (
                        <span className="rounded bg-purple-100 px-2 py-1 font-mono text-purple-700">
                          Promo: {coupon.promoCode}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>Erstellt:</p>
                    <p>{new Date(coupon.created).toLocaleDateString('de-DE')}</p>
                    {coupon.expiresAt && (
                      <>
                        <p className="mt-2">Läuft ab:</p>
                        <p>{new Date(coupon.expiresAt).toLocaleDateString('de-DE')}</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hinweise */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">💡 Verwendung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-900">
          <p>• Coupons können im Stripe Checkout eingegeben werden</p>
          <p>• Promotion Codes werden automatisch erstellt</p>
          <p>• Prozent-Rabatte: 10 = 10% Rabatt auf den Betrag</p>
          <p>• Betrag-Rabatte: 5.00 = 5€ Rabatt auf den Betrag</p>
          <p>• Einmalig: Nur für die erste Rechnung</p>
          <p>• Mehrere Monate: Rabatt für X Monate</p>
          <p>• Für immer: Rabatt auf alle zukünftigen Rechnungen</p>
        </CardContent>
      </Card>
    </div>
  )
}
