// /app/api/admin/coupons/route.ts
/**
 * 🎫 Admin API: Coupon Management
 * GET /api/admin/coupons - Liste aller Coupons
 * POST /api/admin/coupons - Erstelle neuen Coupon
 */

import { requireAdmin } from '@/lib/auth/admin'
import { createCoupon, createPromotionCode, getStripeClient } from '@/lib/stripe/client'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const createCouponSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[A-Z0-9_-]+$/, 'Nur Großbuchstaben, Zahlen, - und _'),
  type: z.enum(['percent', 'amount']),
  value: z.number().positive(),
  duration: z.enum(['once', 'repeating', 'forever']),
  durationInMonths: z.number().int().positive().optional(),
  maxRedemptions: z
    .union([
      z.number().int().positive(),
      z.string().transform((val) => (val === '' ? undefined : parseInt(val, 10))),
    ])
    .optional(),
  expiresAt: z
    .string()
    .refine((val) => val === '' || !isNaN(Date.parse(val)), 'Ungültiges Datum')
    .optional(),
})

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const validation = createCouponSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validierungsfehler',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const data = validation.data

    // Bereinige leere Strings
    const cleanData = {
      ...data,
      maxRedemptions: data.maxRedemptions || undefined,
      expiresAt: data.expiresAt && data.expiresAt !== '' ? data.expiresAt : undefined,
      durationInMonths: data.durationInMonths || undefined,
    }

    // Stripe Coupon erstellen
    const coupon = await createCoupon({
      code: cleanData.code,
      percentOff: cleanData.type === 'percent' ? cleanData.value : undefined,
      amountOff: cleanData.type === 'amount' ? Math.round(cleanData.value * 100) : undefined, // Cent
      duration: cleanData.duration,
      durationInMonths: cleanData.durationInMonths,
      maxRedemptions: cleanData.maxRedemptions,
      expiresAt: cleanData.expiresAt
        ? Math.floor(new Date(cleanData.expiresAt).getTime() / 1000)
        : undefined,
    })

    // Promotion Code erstellen (für Checkout)
    const promoCode = await createPromotionCode({
      couponId: coupon.id,
      code: cleanData.code,
      maxRedemptions: cleanData.maxRedemptions,
      expiresAt: cleanData.expiresAt
        ? Math.floor(new Date(cleanData.expiresAt).getTime() / 1000)
        : undefined,
    })

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: data.code,
        type: data.type,
        value: data.value,
        duration: data.duration,
        promoCodeId: promoCode.id,
      },
    })
  } catch (error) {
    console.error('Coupon Creation Error:', error)

    if (error instanceof Error) {
      if (error.message === 'Nicht authentifiziert') {
        return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
      }
      if (error.message === 'Admin-Rechte erforderlich') {
        return NextResponse.json({ error: 'Admin-Rechte erforderlich' }, { status: 403 })
      }

      // Stripe-Fehler
      if (error.message.includes('already exists')) {
        return NextResponse.json({ error: 'Coupon-Code existiert bereits' }, { status: 400 })
      }
    }

    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}

export async function GET(_request: NextRequest) {
  try {
    await requireAdmin()

    const stripe = getStripeClient()

    // Hole alle Coupons
    const coupons = await stripe.coupons.list({ limit: 100 })

    // Hole alle Promotion Codes
    const promoCodes = await stripe.promotionCodes.list({ limit: 100 })

    // Kombiniere Daten
    const enrichedCoupons = coupons.data.map((coupon) => {
      const promoCode = promoCodes.data.find((pc) => {
        // @ts-expect-error - Stripe PromotionCode.coupon type definition issue
        const pcCoupon = pc.coupon
        if (typeof pcCoupon === 'string') {
          return pcCoupon === coupon.id
        }
        return pcCoupon?.id === coupon.id
      })

      return {
        id: coupon.id,
        code: coupon.name || coupon.id,
        promoCode: promoCode?.code || null,
        type: coupon.percent_off ? 'percent' : 'amount',
        value: coupon.percent_off || (coupon.amount_off ? coupon.amount_off / 100 : 0),
        duration: coupon.duration,
        durationInMonths: coupon.duration_in_months,
        timesRedeemed: coupon.times_redeemed || 0,
        maxRedemptions: coupon.max_redemptions,
        valid: coupon.valid,
        created: new Date(coupon.created * 1000).toISOString(),
        expiresAt: coupon.redeem_by ? new Date(coupon.redeem_by * 1000).toISOString() : null,
      }
    })

    return NextResponse.json({ coupons: enrichedCoupons })
  } catch (error) {
    console.error('Coupon List Error:', error)

    if (error instanceof Error) {
      if (error.message === 'Nicht authentifiziert') {
        return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
      }
      if (error.message === 'Admin-Rechte erforderlich') {
        return NextResponse.json({ error: 'Admin-Rechte erforderlich' }, { status: 403 })
      }
    }

    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}
