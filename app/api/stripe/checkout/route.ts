// /app/api/stripe/checkout/route.ts
/**
 * 💳 Stripe Checkout Session erstellen
 * Erstellt eine neue Checkout Session mit 14 Tage Trial
 */

import { createCheckoutSession, getOrCreateStripeCustomer } from '@/lib/stripe/client'
import { isValidPlanId, PLANS, TRIAL_DAYS } from '@/lib/stripe/plans'
import { createClient } from '@/lib/supabase/server'
import type { PlanId } from '@/lib/types/billing'
import { NextResponse } from 'next/server'
import { z } from 'zod'

// Next.js Route Config
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const preferredRegion = ['fra1']

const requestSchema = z.object({
  planId: z.enum(['starter', 'pro', 'business']),
  coupon: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Auth Check
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    // Request validieren
    const body = await request.json()
    const { planId, coupon } = requestSchema.parse(body)

    if (!isValidPlanId(planId)) {
      return NextResponse.json({ error: 'Ungültiger Plan' }, { status: 400 })
    }

    const plan = PLANS[planId as PlanId]

    // Profil holen
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id, full_name')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: 'Profil nicht gefunden' }, { status: 404 })
    }

    // Stripe Customer holen oder erstellen
    const customer = await getOrCreateStripeCustomer({
      email: user.email!,
      name: profile?.full_name || undefined,
      userId: user.id,
      stripeCustomerId: profile?.stripe_customer_id,
    })

    // Customer ID im Profil speichern (falls neu)
    if (!profile?.stripe_customer_id && customer.id) {
      await supabase.from('profiles').update({ stripe_customer_id: customer.id }).eq('id', user.id)
    }

    // Prüfen ob bereits aktive Subscription vorhanden
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('id, status')
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing'])
      .maybeSingle()

    if (existingSub) {
      return NextResponse.json(
        {
          error:
            'Sie haben bereits ein aktives Abonnement. Bitte nutzen Sie das Kundenportal zur Verwaltung.',
        },
        { status: 400 },
      )
    }

    // Checkout Session erstellen
    const session = await createCheckoutSession({
      customerId: customer.id,
      priceId: plan.stripePriceIdMonthly,
      planId: plan.id,
      userId: user.id,
      trialDays: TRIAL_DAYS,
    })

    // Audit Log
    await supabase.from('audit_log').insert({
      user_id: user.id,
      action: 'checkout_session_created',
      resource_type: 'subscription',
      details: {
        plan_id: planId,
        session_id: session.id,
        coupon: coupon || null,
      },
    })

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Checkout error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ungültige Anfrage', details: error.errors },
        { status: 400 },
      )
    }

    return NextResponse.json({ error: 'Interner Server-Fehler' }, { status: 500 })
  }
}
