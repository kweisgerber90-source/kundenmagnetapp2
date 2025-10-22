// app/api/qr/[id]/download/route.ts
// 📥 Download eigener QR-Dateien (SVG/PNG/PDF) aus Bucket 'qr-codes'.
// 🔒 Zugriff nur auf Datensätze des eingeloggten Users.

import { getEnv } from '@/lib/env'
import { getUser } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const preferredRegion = ['fra1']

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const format = req.nextUrl.searchParams.get('format') || 'png'
    if (!['svg', 'png', 'pdf'].includes(format)) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
    }

    const env = getEnv()
    const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!)

    // 🔒 Nur eigene Datensätze
    const { data: qr, error: qrErr } = await admin
      .from('qr_codes')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (qrErr || !qr) return NextResponse.json({ error: 'QR code not found' }, { status: 404 })

    let filePath: string | null = null
    let contentType = ''
    let filename = ''

    if (format === 'svg') {
      filePath = qr.file_url_svg
      contentType = 'image/svg+xml'
      filename = `qr-${qr.public_id}.svg`
    } else if (format === 'png') {
      filePath = qr.file_url_png
      contentType = 'image/png'
      filename = `qr-${qr.public_id}.png`
    } else {
      filePath = qr.file_url_pdf
      contentType = 'application/pdf'
      filename = `qr-${qr.public_id}.pdf`
    }

    if (!filePath) return NextResponse.json({ error: 'File not available' }, { status: 404 })

    const { data: file, error: fileErr } = await admin.storage.from('qr-codes').download(filePath)
    if (fileErr || !file) {
      console.error('[qr] Storage download error:', fileErr)
      return NextResponse.json({ error: 'Failed to download file' }, { status: 500 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (err) {
    console.error('[qr] download error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
