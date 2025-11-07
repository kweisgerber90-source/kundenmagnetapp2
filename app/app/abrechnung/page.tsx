'use client'

// /app/app/abrechnung/page.tsx
/**
 * 💳 Abrechnungsseite
 * Zeigt aktuelles Abonnement, Plan-Details und Portal-Zugang
 */

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PLANS, formatPriceWithVAT } from '@/lib/stripe/plans'
import { createClient } from '@/lib/supabase/client'
import type { PlanId, SubscriptionStatus } from '@/lib/types/billing'
import { AlertCircle, CheckCircle, CreditCard, ExternalLink, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface SubscriptionData {
  id: string
  plan_id: PlanId
  status: SubscriptionStatus
  current_period_end: string
  cancel_at_period_end: boolean
}

interface ProfileData {
  stripe_customer_id: string | null
  plan_id: PlanId | null
  subscription_status: SubscriptionStatus | null
}

// Simple Loading Skeleton Component (inline, kein Import nötig)
function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded-md bg-gray-200" />
      <div className="h-64 w-full animate-pulse rounded-lg bg-gray-200" />
      <div className="h-32 w-full animate-pulse rounded-lg bg-gray-200" />
    </div>
  )
}

export default function AbrechnungPage() {
  const supabase = createClient()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [profile, setProfile] = useState<ProfileData | null>(null)

  useEffect(() => {
    void loadBillingData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadBillingData() {
    try {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth.user) {
        router.push('/login')
        return
      }

      // Profil laden
      const { data: profileData } = await supabase
        .from('profiles')
        .select('stripe_customer_id, plan_id, subscription_status')
        .eq('id', auth.user.id)
        .single()

      setProfile(profileData as ProfileData)

      // Aktive Subscription laden
      if (profileData?.stripe_customer_id) {
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('id, plan_id, status, current_period_end, cancel_at_period_end')
          .eq('user_id', auth.user.id)
          .in('status', ['active', 'trialing', 'past_due'])
          .maybeSingle()

        setSubscription(subData as SubscriptionData)
      }
    } catch (error) {
      console.error('Error loading billing data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function openPortal() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      if (!res.ok) throw new Error('Portal konnte nicht geöffnet werden')

      const { url } = await res.json()
      window.location.href = url
    } catch (error) {
      console.error('Portal error:', error)
    } finally {
      setPortalLoading(false)
    }
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  const currentPlan = subscription?.plan_id ? PLANS[subscription.plan_id] : null

  const statusLabels: Record<SubscriptionStatus, string> = {
    active: 'Aktiv',
    trialing: 'Testzeitraum',
    past_due: 'Zahlung überfällig',
    canceled: 'Gekündigt',
    inactive: 'Inaktiv',
    incomplete: 'Unvollständig',
    incomplete_expired: 'Abgelaufen',
    paused: 'Pausiert',
    unpaid: 'Unbezahlt',
  }

  const statusColors: Record<string, string> = {
    active: 'text-green-600',
    trialing: 'text-blue-600',
    past_due: 'text-red-600',
    canceled: 'text-gray-600',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Abrechnung & Abonnement</h1>
        <p className="mt-2 text-muted-foreground">
          Verwalten Sie Ihr Abonnement und Ihre Zahlungsmethoden
        </p>
      </div>

      {subscription && currentPlan ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Aktuelles Abonnement</CardTitle>
              <span
                className={`font-medium ${statusColors[subscription.status] || 'text-gray-600'}`}
              >
                {statusLabels[subscription.status] || subscription.status}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="text-xl font-semibold">{currentPlan.nameDE}</p>
                <p className="text-sm text-muted-foreground">
                  {formatPriceWithVAT(currentPlan.priceMonthly)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Nächste Abrechnung</p>
                <p className="text-lg font-medium">
                  {new Date(subscription.current_period_end).toLocaleDateString('de-DE', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                {subscription.cancel_at_period_end && (
                  <p className="text-sm text-amber-600">
                    <AlertCircle className="mr-1 inline h-4 w-4" />
                    Wird nicht verlängert
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-muted/50 p-4">
              <p className="mb-3 font-medium">In Ihrem Plan enthalten:</p>
              <div className="grid gap-2 text-sm">
                {currentPlan.featuresDE.map((feature, i) => (
                  <div key={i} className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={openPortal} disabled={portalLoading} className="w-full md:w-auto">
              {portalLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Öffne Kundenportal…
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" /> Abonnement verwalten
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Alert>
          <AlertDescription>
            Sie haben noch kein aktives Abonnement.{' '}
            <Button variant="link" className="h-auto p-0" onClick={() => router.push('/pricing')}>
              Plan auswählen <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {profile?.stripe_customer_id && (
        <Card>
          <CardHeader>
            <CardTitle>Zahlungsmethoden & Rechnungen</CardTitle>
            <CardDescription>
              Verwalten Sie Zahlungsmethoden und laden Sie Rechnungen herunter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Alles sicher im Stripe-Kundenportal – Zahlungsmethoden, Rechnungen,
              Steuerinformationen.
            </p>
            <Button variant="outline" onClick={openPortal} disabled={portalLoading}>
              {portalLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="mr-2 h-4 w-4" />
              )}
              Kundenportal öffnen
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="border-muted">
        <CardHeader>
          <CardTitle>Hilfe & Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Haben Sie Fragen zu Ihrer Abrechnung oder Ihrem Abonnement?</p>
          <p>
            Kontaktieren Sie uns unter{' '}
            <a href="mailto:support@kundenmagnet-app.de" className="text-primary hover:underline">
              support@kundenmagnet-app.de
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
