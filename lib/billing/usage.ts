/**
 * 📊 Usage Tracking System
 * Erfasst und verwaltet die Nutzung von Features
 */
import { getEnv } from '@/lib/env'
import { PLAN_LIMITS } from '@/lib/stripe/plans'
import type { PlanId, UsageStats } from '@/lib/types/billing'
import { createClient } from '@supabase/supabase-js'
import 'server-only'

/**
 * Track Widget Request
 * Wird bei jedem Widget API Call aufgerufen
 */
export async function trackWidgetRequest(
  userId: string,
  campaignId?: string,
): Promise<{ success: boolean; current: number; limit: number }> {
  const env = getEnv()
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL || '',
    env.SUPABASE_SERVICE_ROLE_KEY || '',
  )

  const { data, error } = await supabase.rpc('increment_widget_usage', {
    p_user_id: userId,
    p_campaign_id: campaignId || null,
  })

  if (error) {
    console.error('[Usage] Error tracking widget request:', error)
    return { success: false, current: 0, limit: 0 }
  }

  // Hole User Plan für Limit
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan_id')
    .eq('id', userId)
    .single()

  const planId: PlanId = profile?.plan_id || 'starter'
  const limit = PLAN_LIMITS[planId].max_widget_requests_per_day

  return {
    success: true,
    current: (data as number) || 0,
    limit,
  }
}

/**
 * Track QR Scan
 * Wird bei jedem QR Code Scan aufgerufen
 */
export async function trackQRScan(
  userId: string,
  qrCodeId?: string,
): Promise<{ success: boolean; current: number; limit: number }> {
  const env = getEnv()
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL || '',
    env.SUPABASE_SERVICE_ROLE_KEY || '',
  )

  const { data, error } = await supabase.rpc('increment_qr_usage', {
    p_user_id: userId,
    p_qr_code_id: qrCodeId || null,
  })

  if (error) {
    console.error('[Usage] Error tracking qr scan:', error)
    return { success: false, current: 0, limit: 0 }
  }

  // Hole User Plan für Limit
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan_id')
    .eq('id', userId)
    .single()

  const planId: PlanId = profile?.plan_id || 'starter'
  const limit = PLAN_LIMITS[planId].max_qr_scans_per_day

  return {
    success: true,
    current: (data as number) || 0,
    limit,
  }
}

/**
 * Hole aktuelle Usage Stats für User Dashboard
 */
export async function getUserUsageStats(userId: string): Promise<UsageStats> {
  const env = getEnv()
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL || '',
    env.SUPABASE_SERVICE_ROLE_KEY || '',
  )

  // Hole Profile für Plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan_id')
    .eq('id', userId)
    .single()

  const planId: PlanId = profile?.plan_id || 'starter'
  const limits = PLAN_LIMITS[planId]

  // Kampagnen Count
  const { count: campaignCount } = await supabase
    .from('campaigns')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // QR Codes Count
  const { count: qrCount } = await supabase
    .from('qr_codes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // Widget Requests heute
  const today = new Date().toISOString().slice(0, 10)
  const { data: widgetUsage } = await supabase
    .from('widget_usage')
    .select('request_count')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle()

  // QR Scans heute
  const { data: qrUsage } = await supabase
    .from('qr_usage')
    .select('scan_count')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle()

  return {
    campaigns: {
      current: campaignCount || 0,
      limit: limits.max_campaigns,
    },
    testimonials: {
      current: 0,
      limit: limits.max_testimonials_per_campaign,
    },
    qrCodes: {
      current: qrCount || 0,
      limit: limits.max_qr_codes,
    },
    widgetRequests: {
      today: widgetUsage?.request_count || 0,
      limit: limits.max_widget_requests_per_day,
    },
    qrScans: {
      today: qrUsage?.scan_count || 0,
      limit: limits.max_qr_scans_per_day,
    },
  }
}
