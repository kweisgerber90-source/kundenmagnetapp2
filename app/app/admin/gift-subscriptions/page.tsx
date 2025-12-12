// /app/app/admin/gift-subscriptions/page.tsx
/**
 * 🎁 Admin: Gift Subscriptions
 * Seite zum Vergeben von kostenlosen Monaten an User
 */

'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { AlertCircle, CheckCircle2, Gift, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

type GiftSubscription = {
  id: string
  user_id: string
  plan_name: string | null
  status: string
  plan_override: {
    free_months: number
    granted_at: string
    granted_by: string
  }
  created_at: string
  updated_at: string
  profiles: {
    email: string
    name: string | null
  }
}

export default function GiftSubscriptionsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingList, setIsFetchingList] = useState(false)
  const [userId, setUserId] = useState('')
  const [months, setMonths] = useState('12')
  const [giftList, setGiftList] = useState<GiftSubscription[]>([])

  // Lade Liste der Gift-Subscriptions
  const fetchGiftList = async () => {
    setIsFetchingList(true)
    try {
      const response = await fetch('/api/admin/gift-subscription')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Laden')
      }

      setGiftList(data.subscriptions || [])
    } catch (error) {
      toast({
        title: 'Fehler',
        description: error instanceof Error ? error.message : 'Fehler beim Laden der Liste',
        variant: 'destructive',
      })
    } finally {
      setIsFetchingList(false)
    }
  }

  useEffect(() => {
    void fetchGiftList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/gift-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          months: parseInt(months, 10),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Vergeben')
      }

      toast({
        title: 'Erfolgreich',
        description: data.message,
      })

      // Formular zurücksetzen
      setUserId('')
      setMonths('12')

      // Liste neu laden
      await fetchGiftList()
    } catch (error) {
      toast({
        title: 'Fehler',
        description: error instanceof Error ? error.message : 'Fehler beim Vergeben',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">🎁 Gift Subscriptions</h1>
        <p className="text-muted-foreground">Vergebe kostenlose Monate an User</p>
      </div>

      {/* Formular */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Neue Gift Subscription vergeben
          </CardTitle>
          <CardDescription>
            Gewähre einem User kostenlose Monate. Diese werden in der Subscription als plan_override
            gespeichert.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID (UUID)</Label>
              <Input
                id="userId"
                type="text"
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                Die UUID des Users findest du in Supabase unter Auth → Users
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="months">Anzahl Monate</Label>
              <Input
                id="months"
                type="number"
                min="1"
                max="36"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                required
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">Mindestens 1, maximal 36 Monate</p>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird vergeben...
                </>
              ) : (
                <>
                  <Gift className="mr-2 h-4 w-4" />
                  Gift Subscription vergeben
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Liste der Gift-Subscriptions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Aktive Gift Subscriptions</CardTitle>
              <CardDescription>Alle User mit plan_override (kostenlose Monate)</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchGiftList} disabled={isFetchingList}>
              {isFetchingList ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Aktualisieren'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isFetchingList ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : giftList.length === 0 ? (
            <div className="rounded-lg border border-dashed py-8 text-center">
              <AlertCircle className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">Keine Gift-Subscriptions vorhanden</p>
            </div>
          ) : (
            <div className="space-y-4">
              {giftList.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-start justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <p className="font-medium">{sub.profiles.name || sub.profiles.email}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{sub.profiles.email}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded bg-green-100 px-2 py-1 text-green-700">
                        {sub.plan_override.free_months} Monate
                      </span>
                      <span className="rounded bg-blue-100 px-2 py-1 text-blue-700">
                        {sub.status}
                      </span>
                      {sub.plan_name && (
                        <span className="rounded bg-purple-100 px-2 py-1 text-purple-700">
                          {sub.plan_name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>Vergeben am:</p>
                    <p>
                      {new Date(sub.plan_override.granted_at).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hinweise */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-900">⚠️ Wichtige Hinweise</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-yellow-900">
          <p>
            • Gift Subscriptions setzen das <code>plan_override</code>-Feld in der Subscription
          </p>
          <p>
            • Die RPC-Funktion <code>grant_free_months</code> benötigt Service-Role-Rechte
          </p>
          <p>• Alle Aktionen werden im Audit Log protokolliert</p>
          <p>
            • User-IDs findest du in Supabase: <strong>Auth → Users → Copy UUID</strong>
          </p>
          <p>
            • Diese Funktion ist nur für Admin-User mit ID in <code>ADMIN_USER_IDS</code> zugänglich
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
