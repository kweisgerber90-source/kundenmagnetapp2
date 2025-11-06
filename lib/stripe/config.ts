// /lib/stripe/config.ts
/**
 * 🔧 Stripe-Konfiguration
 * Zentrale Konfiguration für Stripe-Integration (EU/Deutschland)
 */

import { env } from '@/lib/env'

/** Stripe-Konfiguration (Deutschland/EU) */
export const STRIPE_CONFIG = {
  // API-Keys
  secretKey: env.STRIPE_SECRET_KEY || '',
  webhookSecret: env.STRIPE_WEBHOOK_SECRET || '',
  publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',

  // Basis-URL der App
  appUrl: env.APP_BASE_URL || 'http://localhost:3000',

  // Währung (Deutschland)
  currency: 'eur' as const,

  // Locale (Deutsch)
  locale: 'de' as const,

  // Tax-Konfiguration (Deutschland: 19% MwSt.)
  taxBehavior: 'exclusive' as const, // Preise ohne MwSt., wird hinzugefügt
  automaticTax: true, // Stripe Tax automatisch aktivieren

  // Checkout-Konfiguration
  checkout: {
    mode: 'subscription' as const,
    paymentMethodTypes: ['card', 'sepa_debit'] as const, // Karte + SEPA
    billingAddressCollection: 'required' as const, // Rechnungsadresse erforderlich
    allowPromotionCodes: true, // Gutscheincodes erlauben
    successUrl: `${env.APP_BASE_URL}/app/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${env.APP_BASE_URL}/app/billing/canceled`,
    phoneNumberCollection: {
      enabled: true,
    },
  },

  // Customer-Portal-Konfiguration
  portal: {
    returnUrl: `${env.APP_BASE_URL}/app/billing`,
  },

  // Trial-Konfiguration
  trial: {
    days: 14,
    description: '14 Tage kostenlos testen',
    requiresPaymentMethod: true, // Zahlungsmethode während Trial erforderlich
  },

  // Deutsche UI-Texte
  texts: {
    checkout: {
      title: 'Abonnement abschließen',
      subtitle: 'Wählen Sie Ihr Paket',
      submitButton: 'Jetzt abonnieren',
    },
    portal: { buttonText: 'Abrechnung verwalten' },
    invoice: { footer: 'Vielen Dank für Ihr Vertrauen!' },
    email: {
      paymentSuccessSubject: 'Zahlung erfolgreich',
      paymentFailedSubject: 'Zahlung fehlgeschlagen',
      trialEndingSubject: 'Ihre Testphase endet bald',
      subscriptionCanceledSubject: 'Abonnement gekündigt',
    },
  },

  // Webhook-Events (die wir verarbeiten)
  webhookEvents: [
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'customer.subscription.trial_will_end',
    'invoice.payment_succeeded',
    'invoice.payment_failed',
    'invoice.finalized',
    'charge.succeeded',
    'charge.failed',
    'customer.created',
    'customer.updated',
    'customer.deleted',
  ] as const,

  // Metadata-Keys (für Tracking)
  metadata: {
    userId: 'user_id',
    planId: 'plan_id',
    source: 'kundenmagnetapp',
    environment: env.NODE_ENV,
  },
} as const

/** Prüfe ob Stripe konfiguriert ist */
export function isStripeConfigured(): boolean {
  return Boolean(
    STRIPE_CONFIG.secretKey && STRIPE_CONFIG.webhookSecret && STRIPE_CONFIG.publishableKey,
  )
}

/** Webhook-Signing-Secret holen */
export function getWebhookSecret(): string {
  if (!STRIPE_CONFIG.webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET ist nicht konfiguriert')
  }
  return STRIPE_CONFIG.webhookSecret
}

/** Publishable Key für Client-Side */
export function getPublishableKey(): string {
  if (!STRIPE_CONFIG.publishableKey) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ist nicht konfiguriert')
  }
  return STRIPE_CONFIG.publishableKey
}
