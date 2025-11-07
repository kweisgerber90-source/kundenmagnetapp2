// app/api/diag/stripe/route.ts
// 🧪 Serverseitiger Stripe-Check – sicherer Health-Ping zu Stripe (ohne any)
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const preferredRegion = ['fra1']

export async function GET() {
  try {
    const sk = process.env.STRIPE_SECRET_KEY
    if (!sk) {
      return NextResponse.json({ ok: false, error: 'STRIPE_SECRET_KEY missing' }, { status: 500 })
    }

    // Ohne apiVersion → nutzt die Version der installierten SDK/Typen
    const stripe = new Stripe(sk)

    // Rückgabe-Typ kann je nach SDK variieren → behandeln als unknown und sicher parsen
    const acctUnknown: unknown = await stripe.accounts.retrieve()
    const acctObj = acctUnknown as Record<string, unknown>

    const id = typeof acctObj.id === 'string' ? acctObj.id : null
    const accType = typeof acctObj.type === 'string' ? acctObj.type : null
    const liveModeFlag =
      typeof acctObj.livemode === 'boolean' ? (acctObj.livemode as boolean) : null
    const testmode = liveModeFlag === null ? null : liveModeFlag === false

    return NextResponse.json({
      ok: true,
      account: {
        id,
        type: accType,
        testmode,
      },
    })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'stripe_error'
    return NextResponse.json({ ok: false, error }, { status: 500 })
  }
}
