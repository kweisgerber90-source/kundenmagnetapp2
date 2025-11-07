// app/status/route.ts
// 🔎 Systemstatus (ohne Geheimnisse): zeigt nur Booleans & Metadaten
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const preferredRegion = ['fra1']

export async function GET() {
  const commit = process.env.VERCEL_GIT_COMMIT_SHA || 'local'
  const buildTime = process.env.BUILD_TIME || new Date().toISOString()
  const region = process.env.VERCEL_REGION || 'unknown'

  const hasStripeSecret = !!process.env.STRIPE_SECRET_KEY
  const hasStripeWebhook = !!process.env.STRIPE_WEBHOOK_SECRET
  const hasStripePk = (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '').startsWith('pk_')
  const hasAppBaseUrl = !!process.env.APP_BASE_URL

  return NextResponse.json({
    ok: true,
    env: {
      stripeSecret: hasStripeSecret,
      stripeWebhook: hasStripeWebhook,
      stripePublishable: hasStripePk,
      appBaseUrl: hasAppBaseUrl,
    },
    meta: { commit, buildTime, region, node: process.version },
  })
}
