// app/api/qr/create/route.ts
// 🔐 Authentifiziertes Erstellen von QR-Codes inkl. Upload in Storage-Bucket 'qr-codes'.
// 🔧 Korrektur: Bestehenden Bucket-Namen beibehalten (kein neuer 'qr').

import { BillingGuard } from '@/lib/billing/guard' // 🔧 Korrektur: Einheitliche Limit-Logik + Payload für UI
import { getEnv } from '@/lib/env'
import {
  generateQRCodePNG,
  generateQRCodeSVG,
  validateQRDesign,
  type QRDesign,
} from '@/lib/qr-generator'
import { getUser } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const preferredRegion = ['fra1']
export const maxDuration = 30

function genPublicId() {
  // 🔒 Base64url vermeidet Sonderzeichen in Pfaden
  return randomBytes(8).toString('base64url')
}

interface CreateQRRequest {
  campaign_id: string
  title: string
  design?: QRDesign
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body: CreateQRRequest = await req.json()
    const { campaign_id, title, design = {}, utm_source, utm_medium, utm_campaign } = body
    if (!campaign_id || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 🔍 Design validieren
    const check = validateQRDesign(design)
    if (!check.valid) {
      return NextResponse.json({ error: 'Invalid design', details: check.errors }, { status: 400 })
    }

    const env = getEnv()
    const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!) // 🔑 Server-only

    // 🔎 Kampagne verifizieren (Ownership)
    const { data: campaign, error: campErr } = await admin
      .from('campaigns')
      .select('id, slug, user_id')
      .eq('id', campaign_id)
      .single()

    if (campErr || !campaign || campaign.user_id !== user.id) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // 🔒 Plan-Limit prüfen (QR-Codes)
    // 🔧 Korrektur: Nicht nur boolean (RPC), sondern strukturierte Daten für UI (code/current/limit/planId)
    const guard = await BillingGuard.fromUser(user.id)
    if (!guard) {
      return NextResponse.json({ error: 'Billing guard init failed' }, { status: 500 })
    }

    const limitCheck = await guard.canCreateQRCode()
    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          error: limitCheck.message ?? 'QR code limit reached',
          code: 'LIMIT_EXCEEDED',
          current: typeof limitCheck.current === 'number' ? limitCheck.current : 0,
          limit: typeof limitCheck.limit === 'number' ? limitCheck.limit : 0,
          planId: guard.getPlanId(),
        },
        { status: 403 },
      )
    }

    const public_id = genPublicId()

    // Öffentlicher Redirect-Einstieg:
    const redirectUrl = `${env.APP_BASE_URL}/q/${public_id}`

    // Ziel-URL (internes Routing über /r/[slug]) inkl. UTM – nur Info für Client
    const target = new URL(`${env.APP_BASE_URL}/r/${campaign.slug}`)
    target.searchParams.set('utm_source', utm_source || 'qr')
    target.searchParams.set('utm_medium', utm_medium || 'offline')
    if (utm_campaign) target.searchParams.set('utm_campaign', utm_campaign)
    target.searchParams.set('qr', public_id)
    const targetUrl = target.toString()

    // 🧩 QR erzeugen
    const svg = await generateQRCodeSVG(redirectUrl, design)
    const png = await generateQRCodePNG(redirectUrl, design)

    // 📦 Upload in bestehenden Bucket 'qr-codes': Ordner = user.id
    const svgPath = `${user.id}/${public_id}.svg`
    const pngPath = `${user.id}/${public_id}.png`

    const [upSvg, upPng] = await Promise.all([
      admin.storage
        .from('qr-codes')
        .upload(svgPath, Buffer.from(svg), { contentType: 'image/svg+xml', upsert: false }),
      admin.storage
        .from('qr-codes')
        .upload(pngPath, png, { contentType: 'image/png', upsert: false }),
    ])

    if (upSvg.error || upPng.error) {
      console.error('[qr] Storage upload error:', upSvg.error || upPng.error)
      return NextResponse.json({ error: 'Failed to upload QR files' }, { status: 500 })
    }

    // 🗄️ Datensatz (Design als JSON-Objekt typisieren)
    const designJson: Record<string, unknown> = {
      color: design.color,
      background: design.background,
      errorCorrectionLevel: design.errorCorrectionLevel,
      margin: design.margin,
      size: design.size,
    }

    const { data: qrCode, error: qrErr } = await admin
      .from('qr_codes')
      .insert({
        user_id: user.id,
        campaign_id,
        public_id,
        title,
        design: designJson, // 🔧 Korrektur: kein 'any'
        file_url_svg: svgPath,
        file_url_png: pngPath,
        file_url_pdf: null,
        utm_source: utm_source || 'qr',
        utm_medium: utm_medium || 'offline',
        utm_campaign: utm_campaign || null,
      })
      .select()
      .single()

    if (qrErr || !qrCode) {
      console.error('[qr] insert error:', qrErr)
      return NextResponse.json({ error: 'Failed to save QR code' }, { status: 500 })
    }

    // 📝 Audit-Event (best effort)
    const { error: auditErr } = await admin.from('audit_log').insert({
      actor: user.id,
      action: 'create_qr_code',
      target: qrCode.id,
      meta: { title, campaign_id },
    })
    if (auditErr) {
      // 🔧 Korrektur: Fehler nur protokollieren, nicht durchreichen
      console.warn('[qr] audit insert warn:', auditErr)
    }

    return NextResponse.json({
      id: qrCode.id,
      public_id: qrCode.public_id,
      redirect_url: redirectUrl,
      target_url: targetUrl,
      downloads: {
        svg: `/api/qr/${qrCode.id}/download?format=svg`,
        png: `/api/qr/${qrCode.id}/download?format=png`,
      },
    })
  } catch (err) {
    console.error('[qr] create error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
