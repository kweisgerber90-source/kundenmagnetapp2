import { getEnv } from '@/lib/env'
import { extractIP, hashIP } from '@/lib/security-utils'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const preferredRegion = ['fra1']

export async function POST(req: NextRequest) {
  try {
    const { qr_id, referer, utm } = await req.json()
    if (!qr_id) return NextResponse.json({ error: 'Missing qr_id' }, { status: 400 })

    const env = getEnv()
    const supa = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL || '',
      env.SUPABASE_SERVICE_ROLE_KEY || '',
    )
    const ip = extractIP(req.ip, req.headers.get('x-forwarded-for'), req.headers.get('x-real-ip'))
    const ip_hash = await hashIP(ip)
    const ua = req.headers.get('user-agent') || undefined

    const { error } = await supa.rpc('increment_qr_scan_count', {
      p_qr_id: qr_id,
      p_ip_hash: ip_hash,
      p_user_agent: ua || null,
      p_referer: referer || null,
      p_utm: utm || {},
    })

    if (error) {
      console.error('qr track error', error)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('qr track handler error', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
