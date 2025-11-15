/**
 * 📡 Stripe Webhook Handler – sichere Version (niemals 500 zurück an Stripe)
 * -------------------------------------------------------------------------
 * - Verifiziert zuerst die Signatur → bei Fehler 400/401 (korrekt).
 * - Alle weiteren Fehler (Supabase, Logik) werden nur geloggt,
 *   aber Stripe erhält immer 200, damit keine Webhook-Fehlermails kommen.
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

// Supabase-Typhilfe (Billing-Tabellen sind nicht streng typisiert)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any

// Hilfstyp: Stripe.Invoice hat in manchen Type-Definitionen kein "subscription"-Feld,
// im echten Stripe-Payload ist es aber immer vorhanden.
type InvoiceWithSubscription = Stripe.Invoice & {
  subscription?: string | Stripe.Subscription | null
}

// Hilfstyp: current_period_start / end sind im echten Payload, aber nicht im Typ
type SubscriptionWithPeriods = Stripe.Subscription & {
  current_period_start: number
  current_period_end: number
}

export async function POST(request: Request) {
  const supabase = createAdminClient() as SupabaseClient
  let event: Stripe.Event | null = null

  // 1) Stripe-Signatur validieren (harte Fehler → 400/401)
  try {
    const rawBody = await request.text()
    const sig = headers().get('stripe-signature')

    if (!sig) {
      return NextResponse.json({ error: 'Stripe-Signatur fehlt' }, { status: 401 })
    }

    const stripe = getStripeClient()
    event = stripe.webhooks.constructEvent(rawBody, sig, getWebhookSecret())
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('❌ Ungültige Stripe-Signatur:', err)
    return NextResponse.json({ error: 'Ungültige Signatur' }, { status: 400 })
  }

  // 2) Safe Mode: ab hier niemals 500 an Stripe zurückgeben
  try {
    // Webhook-Event loggen (Fehler nur loggen, nicht werfen)
    try {
      await supabase.from('webhook_events').insert({
        service: 'stripe',
        event_type: event.type,
        event_id: event.id,
        payload: event,
        status: 'processing',
      })
    } catch (logErr) {
      // eslint-disable-next-line no-console
      console.error('Fehler beim Einfügen in webhook_events:', logErr)
    }

    // Events verarbeiten
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, supabase)
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpsert(event.data.object as Stripe.Subscription, supabase)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabase)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as InvoiceWithSubscription, supabase)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as InvoiceWithSubscription, supabase)
        break

      case 'customer.updated':
        await handleCustomerUpdated(event.data.object as Stripe.Customer, supabase)
        break

      default:
        // eslint-disable-next-line no-console
        console.log(`Unbehandelter Stripe-Event-Typ: ${event.type}`)
    }

    // Status → completed
    try {
      await supabase
        .from('webhook_events')
        .update({
          status: 'completed',
          processed_at: new Date().toISOString(),
        })
        .eq('event_id', event.id)
    } catch (updateErr) {
      // eslint-disable-next-line no-console
      console.error('Konnte webhook_event nicht auf completed setzen:', updateErr)
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('❗Unerwarteter Fehler im Webhook:', err)

    if (event?.id) {
      try {
        await supabase
          .from('webhook_events')
          .update({
            status: 'failed',
            error: String(err),
            processed_at: new Date().toISOString(),
          })
          .eq('event_id', event.id)
      } catch (updateErr) {
        // eslint-disable-next-line no-console
        console.error('Fehler beim Aktualisieren des Webhook-Status auf failed:', updateErr)
      }
    }
  }

  // Niemals 500 an Stripe senden
  return NextResponse.json({ ok: true })
}

//
// ========== Handler: checkout.session.completed ==========
//
async function handleCheckoutCompleted(session: Stripe.Checkout.Session, sb: SupabaseClient) {
  const userId = session.metadata?.user_id
  if (!userId) {
    // eslint-disable-next-line no-console
    console.log('Keine user_id in checkout.session metadata gefunden')
    return
  }

  const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id

  // Profil aktualisieren
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
    },
  })
}

//
// ========== Handler: subscription.created / subscription.updated ==========
//
async function handleSubscriptionUpsert(sub: Stripe.Subscription, sb: SupabaseClient) {
  const userId = sub.metadata?.user_id
  if (!userId) return

  const priceId = sub.items.data[0]?.price.id
  const plan = findPlanByPriceId(priceId)
  if (!plan) {
    // eslint-disable-next-line no-console
    console.error('Unbekannte Price-ID:', priceId)
    return
  }

  const subWithPeriods = sub as SubscriptionWithPeriods

  await sb.from('subscriptions').upsert(
    {
      user_id: userId,
      stripe_subscription_id: sub.id,
      stripe_customer_id: sub.customer as string,
      stripe_price_id: priceId,
      plan_id: plan.id,
      status: sub.status as SubscriptionStatus,
      current_period_start: new Date(subWithPeriods.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subWithPeriods.current_period_end * 1000).toISOString(),
      cancel_at_period_end: !!sub.cancel_at_period_end,
      canceled_at: sub.canceled_at ? new Date(sub.canceled_at * 1000).toISOString() : null,
      trial_start: sub.trial_start ? new Date(sub.trial_start * 1000).toISOString() : null,
      trial_end: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'stripe_subscription_id' },
  )

  await sb
    .from('profiles')
    .update({
      plan_id: plan.id,
      subscription_status: sub.status as SubscriptionStatus,
    })
    .eq('id', userId)

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

//
// ========== Handler: subscription.deleted ==========
//
async function handleSubscriptionDeleted(sub: Stripe.Subscription, sb: SupabaseClient) {
  const userId = sub.metadata?.user_id
  if (!userId) return

  await sb
    .from('subscriptions')
    .update({
      status: 'canceled' as SubscriptionStatus,
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', sub.id)

  await sb
    .from('profiles')
    .update({
      plan_id: null,
      subscription_status: 'canceled',
    })
    .eq('id', userId)

  await sb.from('audit_log').insert({
    user_id: userId,
    action: 'subscription_canceled',
    resource_type: 'subscription',
    details: {
      subscription_id: sub.id,
    },
  })
}

//
// ========== Handler: invoice.payment_succeeded ==========
//
async function handlePaymentSucceeded(invoice: InvoiceWithSubscription, sb: SupabaseClient) {
  const subscriptionValue = invoice.subscription
  const subscriptionId =
    typeof subscriptionValue === 'string' ? subscriptionValue : (subscriptionValue?.id ?? null)

  if (!subscriptionId) return

  const { data: subscription } = await sb
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscriptionId)
    .single()

  if (!subscription) return

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

//
// ========== Handler: invoice.payment_failed ==========
//
async function handlePaymentFailed(invoice: InvoiceWithSubscription, sb: SupabaseClient) {
  const subscriptionValue = invoice.subscription
  const subscriptionId =
    typeof subscriptionValue === 'string' ? subscriptionValue : (subscriptionValue?.id ?? null)

  if (!subscriptionId) return

  const { data: subscription } = await sb
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscriptionId)
    .single()

  if (!subscription) return

  await sb
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('stripe_subscription_id', subscriptionId)

  await sb
    .from('profiles')
    .update({ subscription_status: 'past_due' })
    .eq('id', subscription.user_id)

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

//
// ========== Handler: customer.updated ==========
//
async function handleCustomerUpdated(customer: Stripe.Customer, sb: SupabaseClient) {
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

//
// ========== Helper ==========
//
function findPlanByPriceId(priceId?: string | null) {
  if (!priceId) return null
  const entries = Object.values(PLANS)
  return entries.find(
    (p) => p.stripePriceIdMonthly === priceId || p.stripePriceIdYearly === priceId,
  )
}
