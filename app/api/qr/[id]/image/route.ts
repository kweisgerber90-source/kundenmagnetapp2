// app/api/qr/[id]/image/route.ts
// 🔒 DSGVO-konforme Bild-Auslieferung mit signierten URLs
// Nur authentifizierte Nutzer können IHRE EIGENEN QR-Code-Bilder sehen

import { getEnv } from '@/lib/env'
import { getUser } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const preferredRegion = ['fra1']

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 🔐 Authentifizierung prüfen
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const format = req.nextUrl.searchParams.get('format') || 'png'
    if (!['svg', 'png'].includes(format)) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
    }

    const env = getEnv()
    const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!)

    // 🔒 Nur eigene QR-Codes abrufen (RLS)
    const { data: qr, error: qrErr } = await admin
      .from('qr_codes')
      .select('file_url_svg, file_url_png, user_id')
      .eq('id', params.id)
      .single()

    if (qrErr || !qr) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 })
    }

    // 🔒 Ownership prüfen
    if (qr.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const filePath = format === 'svg' ? qr.file_url_svg : qr.file_url_png
    if (!filePath) {
      return NextResponse.json({ error: 'File not available' }, { status: 404 })
    }

    // 📥 Datei aus privatem Storage abrufen
    const { data: file, error: fileErr } = await admin.storage.from('qr-codes').download(filePath)

    if (fileErr || !file) {
      console.error('[qr] image download error:', fileErr)
      return NextResponse.json({ error: 'Failed to load image' }, { status: 500 })
    }

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
    console.error('[qr] image route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
