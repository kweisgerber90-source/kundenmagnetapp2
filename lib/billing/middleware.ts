/**
 * 🛡 Billing Middleware
 * Automatische Limit-Prüfung für geschützte Routen
 */
import { createClient } from '@/lib/supabase/server'
import type { PlanId } from '@/lib/types/billing'
import { NextRequest, NextResponse } from 'next/server'
import { BillingGuard } from './guard'

export interface BillingMiddlewareOptions {
  /**
   * Erforderliche Feature-Flags
   * z.B. ['can_export_csv', 'can_customize_widget']
   */
  requiredFeatures?: Array<keyof typeof import('@/lib/stripe/plans').PLAN_LIMITS.starter>
  /**
   * Minimum erforderlicher Plan
   * z.B. 'pro' = mindestens Pro Plan erforderlich
   */
  minPlan?: PlanId
  /**
   * Custom Error Handler
   */
  onError?: (error: string) => NextResponse
}

/**
 * Middleware Function für Route Protection
 */
export async function withBillingGuard(
  request: NextRequest,
  handler: (guard: BillingGuard, userId: string) => Promise<NextResponse>,
  options: BillingMiddlewareOptions = {},
): Promise<NextResponse> {
  try {
    // 1. Authentifizierung
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    // 2. Billing Guard erstellen
    const guard = await BillingGuard.fromUser(user.id)
    if (!guard) {
      return NextResponse.json({ error: 'Billing Guard Fehler' }, { status: 500 })
    }

    // 3. Feature Checks
    if (options.requiredFeatures) {
      for (const feature of options.requiredFeatures) {
        switch (feature) {
          case 'can_export_csv': {
            const check = guard.canExportCSV()
            if (!check.allowed) return NextResponse.json({ error: check.message }, { status: 403 })
            break
          }
          case 'can_customize_widget': {
            const check = guard.canCustomizeWidget()
            if (!check.allowed) return NextResponse.json({ error: check.message }, { status: 403 })
            break
          }
          case 'can_use_api': {
            const check = guard.canUseAPI()
            if (!check.allowed) return NextResponse.json({ error: check.message }, { status: 403 })
            break
          }
          case 'can_white_label': {
            const check = guard.canWhiteLabel()
            if (!check.allowed) return NextResponse.json({ error: check.message }, { status: 403 })
            break
          }
          default:
            break
        }
      }
    }

    // 4. Custom Handler aufrufen
    return await handler(guard, user.id)
  } catch (error) {
    console.error('[BillingMiddleware] Error:', error)
    if (options.onError) return options.onError('Server Fehler')
    return NextResponse.json({ error: 'Server Fehler' }, { status: 500 })
  }
}
