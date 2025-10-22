// app/q/[publicId]/route.ts
// 🌐 Öffentlicher Redirect-Einstiegspunkt mit Scan-Tracking (anonymisiert).
// 🔐 DSGVO: IP wird gehasht (Pepper), keine Roh-IP speichern.

import { getEnv } from '@/lib/env'
import { extractIP, hashIP } from '@/lib/security-utils'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const preferredRegion = ['fra1']

type UTM = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

export async function GET(req: NextRequest, { params }: { params: { publicId: string } }) {
  try {
    const env = getEnv()
    const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data: qr, error: qrErr } = await admin
      .from('qr_codes')
      .select('id, campaign_id, utm_source, utm_medium, utm_campaign, campaigns(slug)')
      .eq('public_id', params.publicId)
      .single()

    if (qrErr || !qr) {
      return NextResponse.redirect(`${env.APP_BASE_URL}/404`)
    }

    const ip = extractIP(req.ip, req.headers.get('x-forwarded-for'), req.headers.get('x-real-ip'))
    const ip_hash = await hashIP(ip)
    const ua = req.headers.get('user-agent') || null
    const referer = req.headers.get('referer') || null

    const utm: UTM = {
      utm_source: qr.utm_source || 'qr',
      utm_medium: qr.utm_medium || 'offline',
      utm_campaign: qr.utm_campaign || undefined,
    }

    // 📈 Tracking (best effort) — kein await, keine .catch(): Fehlerbehandlung als 2. Argument von .then()
    admin
      .rpc('increment_qr_scan_count', {
        p_qr_id: qr.id,
        p_ip_hash: ip_hash,
        p_user_agent: ua,
        p_referer: referer,
        p_utm: utm as unknown as Record<string, unknown>, // 🔧 Korrektur: kein 'any'
      })
      .then(
        () => {
          // 🔕 Erfolgsfall bewusst ignorieren
        },
        (e: unknown) => {
          // 🔧 Korrektur: Fehler hier behandeln (PromiseLike hat keinen .catch)
          // eslint-disable-next-line no-console
          console.error('[qr] track error:', e)
        },
      )

    const slug = (qr as unknown as { campaigns: { slug: string } }).campaigns.slug
    const target = new URL(`${env.APP_BASE_URL}/r/${slug}`)
    if (utm.utm_source) target.searchParams.set('utm_source', utm.utm_source)
    if (utm.utm_medium) target.searchParams.set('utm_medium', utm.utm_medium)
    if (utm.utm_campaign) target.searchParams.set('utm_campaign', utm.utm_campaign)
    target.searchParams.set('qr', params.publicId)

    return NextResponse.redirect(target.toString(), { status: 302 })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[qr] redirect error:', err)
    const env = getEnv()
    return NextResponse.redirect(`${env.APP_BASE_URL}/404`)
  }
}
