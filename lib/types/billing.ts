// /lib/types/billing.ts
/**
 * 💳 Billing & Subscription Types
 * Definiert alle TypeScript-Typen für die Stripe-Integration.
 */

export type PlanId = 'starter' | 'pro' | 'business'

export type SubscriptionStatus =
  | 'inactive'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'paused'
  | 'unpaid'

/**
 * Plan-Definitionen mit Preisen (in Euro, zzgl. 19% MwSt.)
 */
export interface PlanDefinition {
  id: PlanId
  name: string
  nameDE: string
  description: string
  descriptionDE: string
  priceMonthly: number // in Euro (ohne MwSt.)
  priceYearly?: number // optional: Jahrespreis
  stripePriceIdMonthly: string // wird aus ENV geladen
  stripePriceIdYearly?: string
  features: string[]
  featuresDE: string[]
  highlighted?: boolean
}

/**
 * Plan-Limits (aus DB: plan_limits Tabelle)
 */
export interface PlanLimits {
  plan_id: PlanId
  max_campaigns: number
  max_testimonials_per_campaign: number
  max_qr_codes: number
  max_widget_requests_per_day: number
  max_qr_scans_per_day: number
  can_export_csv: boolean
  can_customize_widget: boolean
  can_use_api: boolean
  can_white_label: boolean
  has_priority_support: boolean
}

/**
 * Subscription (aus DB: subscriptions Tabelle)
 */
export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id: string
  stripe_customer_id: string
  stripe_price_id: string
  plan_id: PlanId
  status: SubscriptionStatus
  current_period_start: string // ISO timestamp
  current_period_end: string
  cancel_at_period_end: boolean
  canceled_at: string | null
  trial_start: string | null
  trial_end: string | null
  created_at: string
  updated_at: string
}

/**
 * User Profile mit Billing-Feldern
 */
export interface ProfileWithBilling {
  id: string
  email: string
  name: string | null
  locale: string
  stripe_customer_id: string | null
  subscription_status: SubscriptionStatus
  plan_id: PlanId
  trial_ends_at: string | null
  created_at: string
  updated_at: string
}

/**
 * Checkout-Session-Daten
 */
export interface CheckoutSessionData {
  sessionId: string
  url: string
}

/**
 * Billing-Portal-Session-Daten
 */
export interface PortalSessionData {
  url: string
}

/**
 * Invoice Item (optional)
 */
export interface InvoiceItem {
  id: string
  user_id: string
  stripe_invoice_id: string
  stripe_invoice_item_id: string
  amount: number // in Cent
  currency: string
  description: string | null
  created_at: string
}

/**
 * Promotion/Coupon
 */
export interface Promotion {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  max_uses: number | null
  uses: number
  expires_at: string | null
  active: boolean
  created_at: string
}

/**
 * Feature-Check-Result
 */
export interface FeatureCheckResult {
  allowed: boolean
  limit?: number
  current?: number
  message?: string
}

/**
 * Usage-Stats für Dashboard
 */
export interface UsageStats {
  campaigns: { current: number; limit: number }
  testimonials: { current: number; limit: number }
  qrCodes: { current: number; limit: number }
  widgetRequests: { today: number; limit: number }
  qrScans: { today: number; limit: number }
}
