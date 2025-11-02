// app/api/qr/[id]/image/route.ts
// -----------------------------------------------------------------------------
// 🔒 DSGVO-konforme Bild-Auslieferung (privater Storage)
// - Nur authentifizierte Nutzer sehen IHRE EIGENEN QR-Code-Bilder
// - Service-Role nur im Node.js-Runtime verwenden
// - ?debug=1 zeigt Klartext-Fehler im Browser (für schnelle Diagnose)
// -----------------------------------------------------------------------------

import { getEnv } from '@/lib/env'
import { getUser } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const preferredRegion = ['fra1']

type QrRow = {
  file_url_svg: string | null
  file_url_png: string | null
  user_id: string
}

/**
 * Supabase Storage erwartet Pfade RELATIV zum Bucket.
 * Falls in der DB versehentlich "qr-codes/..." gespeichert ist,
 * wird das hier bereinigt.
 */
function normalizeStoragePath(path: string): string {
  return path.replace(/^qr-codes\//, '').replace(/^\/+/, '')
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const debug = req.nextUrl.searchParams.get('debug') === '1'

  try {
    // 1) Auth prüfen
    const user = await getUser()
    if (!user) {
      const msg = 'Unauthorized: no session'
      return debug
        ? new NextResponse(msg, { status: 401 })
        : NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2) Format validieren
    const formatParam = req.nextUrl.searchParams.get('format') || 'png'
    const format = formatParam === 'svg' ? 'svg' : formatParam === 'png' ? 'png' : null
    if (!format) {
      const msg = `Invalid format: ${formatParam}`
      return debug
        ? new NextResponse(msg, { status: 400 })
        : NextResponse.json({ error: 'Invalid format' }, { status: 400 })
    }

    // 3) ENV prüfen (häufigste Prod-Ursache)
    const env = getEnv()
    const urlOk = !!env.NEXT_PUBLIC_SUPABASE_URL
    const roleOk = !!env.SUPABASE_SERVICE_ROLE_KEY
    if (!urlOk || !roleOk) {
      const msg = `ENV missing: NEXT_PUBLIC_SUPABASE_URL=${urlOk} SUPABASE_SERVICE_ROLE_KEY=${roleOk}`
      return debug
        ? new NextResponse(msg, { status: 500 })
        : NextResponse.json({ error: 'Server config error' }, { status: 500 })
    }

    // 4) Admin-Client (Service Role) NUR im Node.js-Runtime benutzen
    const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!)

    // 5) Datensatz holen (nur eigene QR-Codes)
    const { data: qr, error: qrErr } = await admin
      .from('qr_codes')
      .select('file_url_svg, file_url_png, user_id')
      .eq('id', params.id)
      .single<QrRow>()

    if (qrErr || !qr) {
      const msg = `QR code not found: ${qrErr?.message ?? 'no row'}`
      return debug
        ? new NextResponse(msg, { status: 404 })
        : NextResponse.json({ error: 'QR code not found' }, { status: 404 })
    }

    // 6) Ownership prüfen
    if (qr.user_id !== user.id) {
      const msg = 'Forbidden: not owner'
      return debug
        ? new NextResponse(msg, { status: 403 })
        : NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 7) Pfad wählen und normalisieren
    const storedPath = format === 'svg' ? qr.file_url_svg : qr.file_url_png
    if (!storedPath) {
      const msg = 'File not available'
      return debug
        ? new NextResponse(msg, { status: 404 })
        : NextResponse.json({ error: 'File not available' }, { status: 404 })
    }
    const filePath = normalizeStoragePath(storedPath)

    // 8) Datei aus privatem Bucket laden
    const { data: file, error: fileErr } = await admin.storage.from('qr-codes').download(filePath)

    if (fileErr || !file) {
      const msg = `[qr] image download error: ${fileErr?.message ?? 'unknown'} (path="${filePath}")`
      console.error(msg)
      return debug
        ? new NextResponse(msg, { status: 500 })
        : NextResponse.json({ error: 'Failed to load image' }, { status: 500 })
    }

    // 9) Antwort bauen
    const buffer = Buffer.from(await file.arrayBuffer())
    const contentType = format === 'svg' ? 'image/svg+xml' : 'image/png'

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, max-age=3600', // 1 Stunde Cache
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[qr] image route error:', msg)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
