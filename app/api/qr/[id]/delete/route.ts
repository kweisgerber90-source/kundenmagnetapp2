// app/api/qr/[id]/delete/route.ts
// 🧹 Löscht QR-Datensatz + zugehörige Dateien, nur für Owner.

import { getEnv } from '@/lib/env'
import { getUser } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const preferredRegion = ['fra1']

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const env = getEnv()
    const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data: qr, error: qrErr } = await admin
      .from('qr_codes')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (qrErr || !qr) return NextResponse.json({ error: 'QR code not found' }, { status: 404 })

    const files = [qr.file_url_svg, qr.file_url_png, qr.file_url_pdf].filter(Boolean) as string[]
    if (files.length > 0) {
      const { error: rmErr } = await admin.storage.from('qr-codes').remove(files)
      if (rmErr) console.error('[qr] Storage delete warning:', rmErr) // 🔧 Korrektur: nur Log
    }

    const { error: delErr } = await admin.from('qr_codes').delete().eq('id', params.id)
    if (delErr) {
      console.error('[qr] delete error:', delErr)
      return NextResponse.json({ error: 'Failed to delete QR code' }, { status: 500 })
    }

    const { error: auditErr } = await admin.from('audit_log').insert({
      actor: user.id,
      action: 'delete_qr_code',
      target: params.id,
      meta: { title: qr.title },
    })
    if (auditErr) {
      console.warn('[qr] audit insert warn:', auditErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[qr] delete error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
