// app/api/qr/quick/route.ts
// ⚡ API: Schnelle QR-Code-Erstellung mit Standardeinstellungen
// 🔐 DSGVO: Kein IP/User-Agent gespeichert, nur Hash bei Scans

import { env } from '@/lib/env'
import { generateQRCodePNG, generateQRCodeSVG } from '@/lib/qr-generator'
import { createClient } from '@/lib/supabase/server'
import { quickQRSchema } from '@/lib/validations/qr'
import { nanoid } from 'nanoid'
import { NextResponse } from 'next/server'

export const preferredRegion = ['fra1']
export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = quickQRSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validierungsfehler', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { campaign_id, title } = parsed.data

    // Prüfe, ob Kampagne existiert und dem Nutzer gehört
    const { data: campaign, error: campError } = await supabase
      .from('campaigns')
      .select('slug, user_id')
      .eq('id', campaign_id)
      .eq('user_id', user.id)
      .single()

    if (campError || !campaign) {
      return NextResponse.json({ error: 'Kampagne nicht gefunden' }, { status: 404 })
    }

    // Generiere eindeutige Public ID
    const public_id = nanoid(10)

    // Redirect-URL (tracking über /q/...)
    const redirectUrl = `${env.APP_BASE_URL}/q/${public_id}`

    // QR-Design: Standard
    const design = {
      color: '#000000',
      background: '#FFFFFF',
      errorCorrectionLevel: 'H' as const,
      margin: 4,
      size: 1024,
    }

    // Erzeuge QR-Codes
    const svg = await generateQRCodeSVG(redirectUrl, design)
    const png = await generateQRCodePNG(redirectUrl, design)

    // Upload zu Supabase Storage
    const svgPath = `${user.id}/${public_id}.svg`
    const pngPath = `${user.id}/${public_id}.png`

    const [upSvg, upPng] = await Promise.all([
      supabase.storage
        .from('qr-codes')
        .upload(svgPath, Buffer.from(svg), { contentType: 'image/svg+xml', upsert: false }),
      supabase.storage
        .from('qr-codes')
        .upload(pngPath, png, { contentType: 'image/png', upsert: false }),
    ])

    if (upSvg.error || upPng.error) {
      console.error('[qr-quick] Storage-Fehler:', upSvg.error || upPng.error)
      return NextResponse.json({ error: 'Fehler beim Speichern der Dateien' }, { status: 500 })
    }

    // Speichere in DB
    const { data: qrCode, error: qrErr } = await supabase
      .from('qr_codes')
      .insert({
        user_id: user.id,
        campaign_id,
        public_id,
        title,
        design: design as unknown as Record<string, unknown>,
        file_url_svg: svgPath,
        file_url_png: pngPath,
        file_url_pdf: null,
        utm_source: 'qr',
        utm_medium: 'offline',
        utm_campaign: null,
      })
      .select()
      .single()

    if (qrErr || !qrCode) {
      console.error('[qr-quick] DB-Fehler:', qrErr)
      return NextResponse.json({ error: 'Fehler beim Erstellen des QR-Codes' }, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        data: qrCode,
        message: 'QR-Code erfolgreich erstellt',
      },
      { status: 201 },
    )
  } catch (err) {
    console.error('[qr-quick] Unerwarteter Fehler:', err)
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}
