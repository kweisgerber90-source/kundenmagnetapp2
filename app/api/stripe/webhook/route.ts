// /app/api/stripe/webhook/route.ts
/**
 * 📡 Stripe Webhook Handler
 * Verarbeitet Stripe Events und synchronisiert mit Supabase
 */

import { getStripeClient } from '@/lib/stripe/client'
import { getWebhookSecret } from '@/lib/stripe/config'
import { PLANS } from '@/lib/stripe/plans'
import { createAdminClient } from '@/lib/supabase/admin'
import type { SubscriptionStatus } from '@/lib/types/billing'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const preferredRegion = ['fra1']

// Helper type for Supabase operations (bypass type checking for billing tables)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any

export async function POST(request: Request) {
  const supabase = createAdminClient() as SupabaseClient
  let event: Stripe.Event | null = null

  try {
    const rawBody = await request.text()
    const sig = headers().get('stripe-signature')

    if (!sig) {
      return NextResponse.json({ error: 'Keine Signatur' }, { status: 401 })
    }

    const stripe = getStripeClient()
    event = stripe.webhooks.constructEvent(rawBody, sig, getWebhookSecret())

    // Webhook-Event loggen (mit explizitem any cast für webhook_events Tabelle)
    await supabase.from('webhook_events').insert({
      service: 'stripe',
      event_type: event.type,
      event_id: event.id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      payload: event as any,
      status: 'processing',
    })

    // Event-Handler
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // ✅ Kurzschluss: Einmalzahlungen (mode: "payment") ignorieren
        // Damit fallen CLI-Trigger (stripe trigger checkout.session.completed) nicht um.
        if (session.mode !== 'subscription') {
          // Optional: leichtgewichtiges Log in webhook_events (status bleibt später "completed")
          await supabase
            .from('webhook_events')
            .insert({
              service: 'stripe',
              event_type: 'checkout.session.completed',
              event_id: event.id,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              payload: { info: 'ignored non-subscription checkout' } as any,
              status: 'processing',
            })
            .catch(() => {}) // Fehler hier bewusst geschluckt, damit Webhook nicht fehlschlägt
          break
        }

        await handleCheckoutCompleted(session, supabase)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpsert(event.data.object as Stripe.Subscription, supabase)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabase)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice, supabase)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice, supabase)
        break

      case 'customer.updated':
        await handleCustomerUpdated(event.data.object as Stripe.Customer, supabase)
        break

      default:
        // eslint-disable-next-line no-console
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Event als completed markieren
    await supabase
      .from('webhook_events')
      .update({
        status: 'completed',
        processed_at: new Date().toISOString(),
      })
      .eq('event_id', event.id)

    return NextResponse.json({ ok: true })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Webhook Error:', err)

    if (event?.id) {
      await supabase
        .from('webhook_events')
        .update({
          status: 'failed',
          processed_at: new Date().toISOString(),
          error: String(err),
        })
        .eq('event_id', event.id)
    }

    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

// ========== Event Handlers ==========

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, sb: SupabaseClient) {
  // ✅ Игнорируем одноразовые платежи (только подписки обрабатываем)
  if (session.mode !== 'subscription') {
    // eslint-disable-next-line no-console
    console.log('Ignored non-subscription checkout:', session.id)
    return
  }

  // 🔒 Erforderlich: user_id muss aus unserer eigenen Checkout-Erstellung kommen
  const userId = session.metadata?.user_id
  if (!userId) {
    // Nichts tun – Event stammt vermutlich nicht aus unserem regulären Flow
    return
  }

  const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id
  const subscriptionId =
    typeof session.subscription === 'string' ? session.subscription : session.subscription?.id

  // Profil-Update nur, wenn eine customerId existiert
  if (customerId) {
    await sb
      .from('profiles')
      .update({
        stripe_customer_id: customerId,
        has_completed_onboarding: true,
      })
      .eq('id', userId)
  }

  // Audit Log
  await sb.from('audit_log').insert({
    user_id: userId,
    action: 'checkout_completed',
    resource_type: 'subscription',
    details: {
      session_id: session.id,
      customer_id: customerId ?? null,
      subscription_id: subscriptionId ?? null,
      amount_total: session.amount_total ?? null,
    },
  })
}

async function handleSubscriptionUpsert(sub: Stripe.Subscription, sb: SupabaseClient) {
  const userId = sub.metadata?.user_id
  if (!userId) return

  const priceId = sub.items.data[0]?.price.id
  const plan = findPlanByPriceId(priceId)

  if (!plan) {
    // eslint-disable-next-line no-console
    console.error('Unknown price ID:', priceId)
    return
  }

  // Subscription upserten (mit expliziten Typ-Casts)
  await sb.from('subscriptions').upsert({
    id: sub.id,
    user_id: userId,
    stripe_subscription_id: sub.id,
    stripe_customer_id: sub.customer as string,
    stripe_price_id: priceId,
    plan_id: plan.id,
    status: sub.status as SubscriptionStatus,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    current_period_start: new Date((sub as any).current_period_start * 1000).toISOString(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
    cancel_at_period_end: sub.cancel_at_period_end,
    canceled_at: sub.canceled_at ? new Date(sub.canceled_at * 1000).toISOString() : null,
    trial_start: sub.trial_start ? new Date(sub.trial_start * 1000).toISOString() : null,
    trial_end: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
    updated_at: new Date().toISOString(),
  })

  // Profil aktualisieren
  await sb
    .from('profiles')
    .update({
      plan_id: plan.id,
      subscription_status: sub.status as SubscriptionStatus,
    })
    .eq('id', userId)

  // Audit Log
  await sb.from('audit_log').insert({
    user_id: userId,
    action: 'subscription_updated',
    resource_type: 'subscription',
    details: {
      subscription_id: sub.id,
      plan_id: plan.id,
      status: sub.status,
    },
  })
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription, sb: SupabaseClient) {
  const userId = sub.metadata?.user_id
  if (!userId) return

  // Subscription als canceled markieren
  await sb
    .from('subscriptions')
    .update({
      status: 'canceled' as SubscriptionStatus,
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', sub.id)

  // Profil aktualisieren
  await sb
    .from('profiles')
    .update({
      plan_id: null,
      subscription_status: 'canceled' as SubscriptionStatus,
    })
    .eq('id', userId)

  // Audit Log
  await sb.from('audit_log').insert({
    user_id: userId,
    action: 'subscription_canceled',
    resource_type: 'subscription',
    details: {
      subscription_id: sub.id,
    },
  })
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice, sb: SupabaseClient) {
  // Stripe Invoice hat subscription als string | Stripe.Subscription

  const subscriptionId =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (invoice as any).subscription === 'string'
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (invoice as any).subscription
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (invoice as any).subscription?.id

  if (!subscriptionId) return

  // User ID von Subscription holen
  const { data: subscription } = await sb
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscriptionId)
    .single()

  if (!subscription) return

  // Payment Record erstellen
  await sb.from('payments').insert({
    user_id: subscription.user_id,
    subscription_id: subscriptionId,
    stripe_invoice_id: invoice.id,
    amount: invoice.amount_paid,
    currency: invoice.currency,
    status: 'succeeded',
    paid_at: new Date().toISOString(),
    metadata: {
      invoice_number: invoice.number,
      invoice_pdf: invoice.invoice_pdf,
      hosted_invoice_url: invoice.hosted_invoice_url,
    },
  })

  // Audit Log
  await sb.from('audit_log').insert({
    user_id: subscription.user_id,
    action: 'payment_succeeded',
    resource_type: 'payment',
    details: {
      invoice_id: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
    },
  })
}

async function handlePaymentFailed(invoice: Stripe.Invoice, sb: SupabaseClient) {
  // Stripe Invoice hat subscription als string | Stripe.Subscription

  const subscriptionId =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (invoice as any).subscription === 'string'
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (invoice as any).subscription
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (invoice as any).subscription?.id

  if (!subscriptionId) return

  // User ID von Subscription holen
  const { data: subscription } = await sb
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscriptionId)
    .single()

  if (!subscription) return

  // Subscription Status aktualisieren
  await sb
    .from('subscriptions')
    .update({ status: 'past_due' as SubscriptionStatus })
    .eq('stripe_subscription_id', subscriptionId)

  // Profil aktualisieren
  await sb
    .from('profiles')
    .update({ subscription_status: 'past_due' as SubscriptionStatus })
    .eq('id', subscription.user_id)

  // Audit Log
  await sb.from('audit_log').insert({
    user_id: subscription.user_id,
    action: 'payment_failed',
    resource_type: 'payment',
    details: {
      invoice_id: invoice.id,
      amount: invoice.amount_due,
      attempt_count: invoice.attempt_count,
    },
  })
}

async function handleCustomerUpdated(customer: Stripe.Customer, sb: SupabaseClient) {
  // Profil aktualisieren
  const { data: profile } = await sb
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customer.id)
    .single()

  if (!profile) return

  await sb
    .from('profiles')
    .update({
      full_name: customer.name || undefined,
    })
    .eq('id', profile.id)
}

// ========== Helpers ==========

function findPlanByPriceId(priceId?: string | null) {
  if (!priceId) return null
  const entries = Object.values(PLANS)
  return entries.find(
    (p) => p.stripePriceIdMonthly === priceId || p.stripePriceIdYearly === priceId,
  )
}
