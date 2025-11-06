// /lib/stripe/plans.ts
/**
 * 📦 Plan-Definitionen für Kundenmagnetapp
 * Preise: 9€ / 19€ / 39€ zzgl. 19% MwSt.
 */

import type { PlanDefinition, PlanId } from '@/lib/types/billing'

/** MwSt.-Satz Deutschland */
export const VAT_RATE = 0.19 // 19%

/** Preise inkl. MwSt. berechnen */
export function calculatePriceWithVAT(priceExclVAT: number): number {
  return Math.round(priceExclVAT * (1 + VAT_RATE) * 100) / 100
}

/** Plan-IDs */
export const PLAN_IDS: Record<string, PlanId> = {
  STARTER: 'starter',
  PRO: 'pro',
  BUSINESS: 'business',
} as const

/** Default Plan für neue User (14 Tage Trial) */
export const DEFAULT_PLAN: PlanId = 'starter'
export const TRIAL_DAYS = 14

/**
 * Stripe Price IDs (aus ENV geladen)
 * Diese müssen im Stripe Dashboard erstellt werden
 */
export const STRIPE_PRICE_IDS = {
  starter_monthly: process.env.STRIPE_PRICE_ID_STARTER_MONTHLY || '',
  pro_monthly: process.env.STRIPE_PRICE_ID_PRO_MONTHLY || '',
  business_monthly: process.env.STRIPE_PRICE_ID_BUSINESS_MONTHLY || '',
  // Optional: Jahrespreise
  starter_yearly: process.env.STRIPE_PRICE_ID_STARTER_YEARLY || '',
  pro_yearly: process.env.STRIPE_PRICE_ID_PRO_YEARLY || '',
  business_yearly: process.env.STRIPE_PRICE_ID_BUSINESS_YEARLY || '',
} as const

/** Plan-Definitionen (Marketing & Features) */
export const PLANS: Record<PlanId, PlanDefinition> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    nameDE: 'Starter',
    description: 'Perfect for small businesses starting with testimonials',
    descriptionDE: 'Ideal für kleine Unternehmen, die mit Kundenbewertungen starten',
    priceMonthly: 9,
    stripePriceIdMonthly: STRIPE_PRICE_IDS.starter_monthly,
    features: [
      'Up to 2 campaigns',
      'Up to 50 testimonials per campaign',
      '5 QR codes',
      'Basic widget customization',
      '1,000 widget requests/day',
      '100 QR scans/day',
      'Email support',
    ],
    featuresDE: [
      'Bis zu 2 Kampagnen',
      'Bis zu 50 Testimonials pro Kampagne',
      '5 QR-Codes',
      'Basis Widget-Anpassung',
      '1.000 Widget-Anfragen/Tag',
      '100 QR-Scans/Tag',
      'E-Mail Support',
    ],
  },

  pro: {
    id: 'pro',
    name: 'Pro',
    nameDE: 'Pro',
    description: 'For growing businesses that need more flexibility',
    descriptionDE: 'Für wachsende Unternehmen, die mehr Flexibilität benötigen',
    priceMonthly: 19,
    stripePriceIdMonthly: STRIPE_PRICE_IDS.pro_monthly,
    features: [
      'Up to 10 campaigns',
      'Up to 200 testimonials per campaign',
      '20 QR codes',
      'Advanced widget customization',
      'CSV export',
      '5,000 widget requests/day',
      '500 QR scans/day',
      'Priority email support',
    ],
    featuresDE: [
      'Bis zu 10 Kampagnen',
      'Bis zu 200 Testimonials pro Kampagne',
      '20 QR-Codes',
      'Erweiterte Widget-Anpassung',
      'CSV-Export',
      '5.000 Widget-Anfragen/Tag',
      '500 QR-Scans/Tag',
      'Priorisierter E-Mail Support',
    ],
    highlighted: true,
  },

  business: {
    id: 'business',
    name: 'Business',
    nameDE: 'Business',
    description: 'For agencies and enterprises with unlimited needs',
    descriptionDE: 'Für Agenturen und Unternehmen mit unbegrenzten Anforderungen',
    priceMonthly: 39,
    stripePriceIdMonthly: STRIPE_PRICE_IDS.business_monthly,
    features: [
      'Unlimited campaigns',
      'Unlimited testimonials',
      '100 QR codes',
      'White-label widget',
      'API access',
      'CSV & PDF export',
      '50,000 widget requests/day',
      '5,000 QR scans/day',
      'Priority support & onboarding',
    ],
    featuresDE: [
      'Unbegrenzte Kampagnen',
      'Unbegrenzte Testimonials',
      '100 QR-Codes',
      'White-Label Widget',
      'API-Zugang',
      'CSV & PDF Export',
      '50.000 Widget-Anfragen/Tag',
      '5.000 QR-Scans/Tag',
      'Priority Support & Onboarding',
    ],
  },
}

/** Plan-Sortierung für Pricing-Seite */
export const PLAN_ORDER: PlanId[] = ['starter', 'pro', 'business']

/**
 * Plan-Limits (Sync mit DB: plan_limits Tabelle)
 * Diese werden in der DB gespeichert, hier als Konstanten für Type-Safety
 */
export const PLAN_LIMITS = {
  starter: {
    max_campaigns: 2,
    max_testimonials_per_campaign: 50,
    max_qr_codes: 5,
    max_widget_requests_per_day: 1000,
    max_qr_scans_per_day: 100,
    can_export_csv: false,
    can_customize_widget: false,
    can_use_api: false,
    can_white_label: false,
    has_priority_support: false,
  },
  pro: {
    max_campaigns: 10,
    max_testimonials_per_campaign: 200,
    max_qr_codes: 20,
    max_widget_requests_per_day: 5000,
    max_qr_scans_per_day: 500,
    can_export_csv: true,
    can_customize_widget: true,
    can_use_api: false,
    can_white_label: false,
    has_priority_support: false,
  },
  business: {
    max_campaigns: 9999, // "Unlimited"
    max_testimonials_per_campaign: 9999,
    max_qr_codes: 100,
    max_widget_requests_per_day: 50000,
    max_qr_scans_per_day: 5000,
    can_export_csv: true,
    can_customize_widget: true,
    can_use_api: true,
    can_white_label: true,
    has_priority_support: true,
  },
} as const

/** Helper: Get Plan by ID */
export function getPlanById(planId: PlanId): PlanDefinition {
  return PLANS[planId]
}

/** Helper: Get all Plans in order */
export function getAllPlans(): PlanDefinition[] {
  return PLAN_ORDER.map((id) => PLANS[id])
}

/** Helper: Check if plan exists */
export function isValidPlanId(planId: string): planId is PlanId {
  return planId in PLANS
}

/** Helper: Upgrade-Path */
export function getUpgradePath(currentPlan: PlanId): PlanId[] {
  const index = PLAN_ORDER.indexOf(currentPlan)
  return PLAN_ORDER.slice(index + 1)
}

/** Helper: Downgrade-Path */
export function getDowngradePath(currentPlan: PlanId): PlanId[] {
  const index = PLAN_ORDER.indexOf(currentPlan)
  return PLAN_ORDER.slice(0, index).reverse()
}

/** Preis inkl. MwSt. formatiert anzeigen */
export function formatPriceWithVAT(priceExclVAT: number): string {
  const inclVAT = calculatePriceWithVAT(priceExclVAT)
  return `${priceExclVAT.toFixed(2)} € zzgl. 19% MwSt. (${inclVAT.toFixed(2)} € inkl. MwSt.)`
}
