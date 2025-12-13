// /lib/billing/guard.ts
/**
 * 🛡 Billing Guard - Feature Checks & Limit Enforcement
 * Zentrale Service-Klasse für Plan-basierte Zugriffskontrolle
 */

import { getEnv } from '@/lib/env'
import { PLAN_LIMITS } from '@/lib/stripe/plans'
import type { FeatureCheckResult, PlanId } from '@/lib/types/billing'
import { createClient } from '@supabase/supabase-js'
import 'server-only'

// 🔧 Korrektur: PlanLimits aus PLAN_LIMITS ableiten (ohne "plan_id" Pflichtfeld)
type PlanLimitsFromConfig = (typeof PLAN_LIMITS)[PlanId]

// 🔧 Korrektur: In diesem Projekt wird "unlimited" über hohe Zahl (z.B. 9999) abgebildet, nicht über -1
const UNLIMITED_THRESHOLD = 9999

export class BillingGuard {
  private userId: string
  private planId: PlanId
  private limits: PlanLimitsFromConfig

  constructor(userId: string, planId: PlanId) {
    this.userId = userId
    this.planId = planId
    this.limits = PLAN_LIMITS[planId]
  }

  static async fromUser(userId: string): Promise<BillingGuard | null> {
    const env = getEnv()
    const supabase = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL || '',
      env.SUPABASE_SERVICE_ROLE_KEY || '',
    )

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('plan_id, subscription_status')
      .eq('id', userId)
      .single()

    if (error || !profile) {
      console.error('[BillingGuard] Failed to fetch profile:', error)
      return null
    }

    // Bei trialing oder active Status verwenden wir den Plan
    // Bei anderen Status (canceled, past_due) verwenden wir Starter als Fallback
    const effectivePlanId: PlanId =
      profile.subscription_status === 'active' || profile.subscription_status === 'trialing'
        ? (profile.plan_id as PlanId)
        : 'starter'

    return new BillingGuard(userId, effectivePlanId)
  }

  getPlanId(): PlanId {
    return this.planId
  }

  getLimits(): PlanLimitsFromConfig {
    return this.limits
  }

  /**
   * ✅ Kampagnen-Limit
   */
  async canCreateCampaign(): Promise<FeatureCheckResult> {
    const env = getEnv()
    const supabase = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL || '',
      env.SUPABASE_SERVICE_ROLE_KEY || '',
    )

    const { count, error } = await supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', this.userId)

    if (error) {
      console.error('[BillingGuard] Error counting campaigns:', error)
      return { allowed: false, message: 'Fehler beim Prüfen des Kampagnen-Limits' }
    }

    const current = count || 0
    const limit = this.limits.max_campaigns

    if (limit >= UNLIMITED_THRESHOLD) return { allowed: true, current, limit }

    return {
      allowed: current < limit,
      current,
      limit,
      message:
        current >= limit
          ? `Kampagnen-Limit erreicht (${current}/${limit}). Bitte upgraden.`
          : undefined,
    }
  }

  /**
   * ✅ QR-Code-Limit
   */
  async canCreateQRCode(): Promise<FeatureCheckResult> {
    const env = getEnv()
    const supabase = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL || '',
      env.SUPABASE_SERVICE_ROLE_KEY || '',
    )

    const { count, error } = await supabase
      .from('qr_codes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', this.userId)

    if (error) {
      console.error('[BillingGuard] Error counting qr codes:', error)
      return { allowed: false, message: 'Fehler beim Prüfen des QR-Code-Limits' }
    }

    const current = count || 0
    const limit = this.limits.max_qr_codes

    if (limit >= UNLIMITED_THRESHOLD) return { allowed: true, current, limit }

    return {
      allowed: current < limit,
      current,
      limit,
      message:
        current >= limit
          ? `QR-Code-Limit erreicht (${current}/${limit}). Bitte upgraden.`
          : undefined,
    }
  }

  /**
   * ✅ Tageslimit: Widget Requests
   * Erwartet vorhandene Tabelle "widget_usage" (Step 4E Migration).
   */
  async canMakeWidgetRequest(): Promise<FeatureCheckResult> {
    const env = getEnv()
    const supabase = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL || '',
      env.SUPABASE_SERVICE_ROLE_KEY || '',
    )

    const today = new Date().toISOString().slice(0, 10)

    const { data, error } = await supabase
      .from('widget_usage')
      .select('request_count')
      .eq('user_id', this.userId)
      .eq('date', today)
      .maybeSingle()

    if (error) {
      console.error('[BillingGuard] Error checking widget usage:', error)
      // 🔧 Korrektur: fail-open, damit öffentliches Widget nicht komplett bricht
      return { allowed: true }
    }

    const current = data?.request_count || 0
    const limit = this.limits.max_widget_requests_per_day

    if (limit >= UNLIMITED_THRESHOLD) return { allowed: true, current, limit }

    return {
      allowed: current < limit,
      current,
      limit,
      message:
        current >= limit
          ? `Tages-Limit für Widget-Anfragen erreicht (${current}/${limit}).`
          : undefined,
    }
  }

  /**
   * ✅ Tageslimit: QR Scans
   * Erwartet vorhandene Tabelle "qr_usage" (Step 4E Migration).
   */
  async canMakeQRScan(): Promise<FeatureCheckResult> {
    const env = getEnv()
    const supabase = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL || '',
      env.SUPABASE_SERVICE_ROLE_KEY || '',
    )

    const today = new Date().toISOString().slice(0, 10)

    const { data, error } = await supabase
      .from('qr_usage')
      .select('scan_count')
      .eq('user_id', this.userId)
      .eq('date', today)
      .maybeSingle()

    if (error) {
      console.error('[BillingGuard] Error checking qr usage:', error)
      // 🔧 Korrektur: fail-open, damit QR nicht komplett bricht
      return { allowed: true }
    }

    const current = data?.scan_count || 0
    const limit = this.limits.max_qr_scans_per_day

    if (limit >= UNLIMITED_THRESHOLD) return { allowed: true, current, limit }

    return {
      allowed: current < limit,
      current,
      limit,
      message:
        current >= limit ? `Tages-Limit für QR-Scans erreicht (${current}/${limit}).` : undefined,
    }
  }

  /**
   * ✅ Feature Flags (boolean)
   */
  canExportCSV(): FeatureCheckResult {
    return this.limits.can_export_csv
      ? { allowed: true }
      : { allowed: false, message: 'CSV Export ist nur im Pro Plan verfügbar' }
  }

  canCustomizeWidget(): FeatureCheckResult {
    return this.limits.can_customize_widget
      ? { allowed: true }
      : { allowed: false, message: 'Widget-Anpassung ist nur im Pro Plan verfügbar' }
  }

  canUseAPI(): FeatureCheckResult {
    return this.limits.can_use_api
      ? { allowed: true }
      : { allowed: false, message: 'API Zugriff ist nur im Business Plan verfügbar' }
  }

  canWhiteLabel(): FeatureCheckResult {
    return this.limits.can_white_label
      ? { allowed: true }
      : { allowed: false, message: 'White-label ist nur im Business Plan verfügbar' }
  }
}
