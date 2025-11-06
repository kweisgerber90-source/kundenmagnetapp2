// /lib/stripe/client.ts
/**
 * 🔐 Stripe Server-Side Client
 * NUR auf dem Server verwenden (API Routes, Server Components)
 */

import { env } from '@/lib/env'
import Stripe from 'stripe'
import { STRIPE_CONFIG, isStripeConfigured } from './config'

// Singleton Stripe-Client
let stripeInstance: Stripe | null = null

/** Erstelle oder hole Stripe-Client-Instanz */
export function getStripeClient(): Stripe {
  if (stripeInstance) return stripeInstance

  if (!isStripeConfigured()) {
    throw new Error(
      // 🔧 Korrektur: Fehlermeldung präzisiert (deutlichere ENV-Hinweise)
      'Stripe ist nicht konfiguriert. Bitte STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET und NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local setzen.',
    )
  }

  stripeInstance = new Stripe(STRIPE_CONFIG.secretKey, {
    // 🔧 Korrektur: stabile API-Version statt Preview
    typescript: true,
    appInfo: {
      name: 'Kundenmagnetapp',
      version: '1.0.0',
      url: 'https://kundenmagnet-app.de',
    },
    // maxNetworkRetries: 3 ist Standard ausreichend; hier explizit gesetzt
    maxNetworkRetries: 3,
    // 🔧 Korrektur: Entfernt unbekannte Option "telemetry" (verursachte TS-Fehler)
  })

  return stripeInstance
}

/** Erstelle Stripe Customer */
export async function createStripeCustomer(params: {
  email: string
  name?: string
  userId: string
}): Promise<Stripe.Customer> {
  const stripe = getStripeClient()

  const customer = await stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: { user_id: params.userId, source: 'kundenmagnetapp', environment: env.NODE_ENV },
    preferred_locales: ['de'],
  })

  return customer
}

/** Hole oder erstelle Stripe Customer */
export async function getOrCreateStripeCustomer(params: {
  email: string
  name?: string
  userId: string
  stripeCustomerId?: string | null
}): Promise<Stripe.Customer> {
  const stripe = getStripeClient()

  // Wenn Customer-ID vorhanden, versuche zu laden
  if (params.stripeCustomerId) {
    try {
      const customer = await stripe.customers.retrieve(params.stripeCustomerId)
      if (!('deleted' in customer && customer.deleted)) {
        return customer as Stripe.Customer
      }
    } catch {
      // eslint-disable-next-line no-console
      console.error('Stripe Customer nicht gefunden, wird neu erstellt.')
    }
  }

  // Suche nach existierendem Customer via E-Mail
  const existingCustomers = await stripe.customers.list({ email: params.email, limit: 1 })
  if (existingCustomers.data.length > 0) return existingCustomers.data[0]

  // Erstelle neuen Customer
  return createStripeCustomer(params)
}

/** Erstelle Checkout Session */
export async function createCheckoutSession(params: {
  customerId: string
  priceId: string
  planId: string
  userId: string
  trialDays?: number
}): Promise<Stripe.Checkout.Session> {
  const stripe = getStripeClient()

  const session = await stripe.checkout.sessions.create({
    customer: params.customerId,
    mode: 'subscription',
    payment_method_types: ['card', 'sepa_debit'],
    line_items: [{ price: params.priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: params.trialDays,
      metadata: { user_id: params.userId, plan_id: params.planId },
    },
    metadata: { user_id: params.userId, plan_id: params.planId },
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    phone_number_collection: { enabled: true },
    automatic_tax: { enabled: true }, // Stripe Tax für automatische MwSt.
    tax_id_collection: { enabled: true }, // USt-IdNr. erfassen (B2B)
    success_url: STRIPE_CONFIG.checkout.successUrl,
    cancel_url: STRIPE_CONFIG.checkout.cancelUrl,
    locale: 'de',
  })

  return session
}

/** Erstelle Billing Portal Session */
export async function createPortalSession(
  customerId: string,
): Promise<Stripe.BillingPortal.Session> {
  const stripe = getStripeClient()
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: STRIPE_CONFIG.portal.returnUrl,
    locale: 'de',
  })
}

/** Hole aktive Subscription eines Customers */
export async function getActiveSubscription(
  customerId: string,
): Promise<Stripe.Subscription | null> {
  const stripe = getStripeClient()
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  })
  return subscriptions.data[0] || null
}

/** Kündige Subscription (am Periodenende) */
export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  const stripe = getStripeClient()
  return stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true })
}

/** Reaktiviere Subscription (cancel_at_period_end entfernen) */
export async function reactivateSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  const stripe = getStripeClient()
  return stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: false })
}

/** Upgrade/Downgrade Subscription */
export async function updateSubscriptionPlan(params: {
  subscriptionId: string
  newPriceId: string
  prorationBehavior?: 'create_prorations' | 'none' | 'always_invoice'
}): Promise<Stripe.Subscription> {
  const stripe = getStripeClient()
  const subscription = await stripe.subscriptions.retrieve(params.subscriptionId)
  const currentItemId = subscription.items.data[0].id

  return stripe.subscriptions.update(params.subscriptionId, {
    items: [{ id: currentItemId, price: params.newPriceId }],
    proration_behavior: params.prorationBehavior || 'create_prorations',
  })
}

/** Hole Invoice */
export async function getInvoice(invoiceId: string): Promise<Stripe.Invoice> {
  const stripe = getStripeClient()
  return stripe.invoices.retrieve(invoiceId)
}

/** Liste alle Invoices eines Customers */
export async function listInvoices(params: {
  customerId: string
  limit?: number
}): Promise<Stripe.Invoice[]> {
  const stripe = getStripeClient()
  const invoices = await stripe.invoices.list({
    customer: params.customerId,
    limit: params.limit || 10,
  })
  return invoices.data
}

/** Erstelle Coupon */
export async function createCoupon(params: {
  code: string
  percentOff?: number
  amountOff?: number
  duration: 'once' | 'repeating' | 'forever'
  durationInMonths?: number
  maxRedemptions?: number
  expiresAt?: number
}): Promise<Stripe.Coupon> {
  const stripe = getStripeClient()
  return stripe.coupons.create({
    id: params.code,
    percent_off: params.percentOff,
    amount_off: params.amountOff,
    currency: params.amountOff ? 'eur' : undefined,
    duration: params.duration,
    duration_in_months: params.durationInMonths,
    max_redemptions: params.maxRedemptions,
    redeem_by: params.expiresAt,
  })
}

/** Erstelle Promotion Code */
export async function createPromotionCode(params: {
  couponId: string
  code: string
  maxRedemptions?: number
  expiresAt?: number
}): Promise<Stripe.PromotionCode> {
  const stripe = getStripeClient()
  return stripe.promotionCodes.create({
    promotion: {
      type: 'coupon',
      coupon: params.couponId,
    },
    code: params.code,
    max_redemptions: params.maxRedemptions,
    expires_at: params.expiresAt,
  })
}

// Export Stripe-Client für erweiterte Nutzung
export { getStripeClient as stripe }
