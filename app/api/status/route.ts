// app/api/status/route.ts
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const preferredRegion = ['fra1']

export async function GET() {
  const commit = process.env.VERCEL_GIT_COMMIT_SHA || 'local'
  const buildTime = process.env.BUILD_TIME || new Date().toISOString()
  const region = process.env.VERCEL_REGION || 'unknown'

  return NextResponse.json({
    ok: true,
    env: {
      stripeSecret: !!process.env.STRIPE_SECRET_KEY,
      stripeWebhook: !!process.env.STRIPE_WEBHOOK_SECRET,
      stripePublishable: (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '').startsWith('pk_'),
      appBaseUrl: !!process.env.APP_BASE_URL,
    },
    meta: { commit, buildTime, region, node: process.version },
  })
}
