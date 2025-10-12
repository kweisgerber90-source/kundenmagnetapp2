import { getEnv } from '@/lib/env'
import { extractIP, hashIP } from '@/lib/security-utils'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const preferredRegion = ['fra1']

export async function POST(req: NextRequest) {
  try {
    const { slug, name, email, text, rating, consentText } = await req.json()
    if (!slug || !name || !text) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const env = getEnv()
    const supa = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL || '',
      env.SUPABASE_SERVICE_ROLE_KEY || '',
    )

    // Найти активную кампанию
    const { data: camp, error: cErr } = await supa
      .from('campaigns')
      .select('id,status')
      .eq('slug', slug)
      .single()

    if (cErr || !camp || camp.status !== 'active') {
      return NextResponse.json({ error: 'Campaign not found/active' }, { status: 404 })
    }

    const ip = extractIP(req.ip, req.headers.get('x-forwarded-for'), req.headers.get('x-real-ip'))
    const ip_hash = await hashIP(ip)
    const ua = req.headers.get('user-agent') || undefined

    const { error } = await supa.from('testimonials').insert({
      campaign_id: camp.id,
      name,
      email: email || null,
      text,
      rating: rating ?? null,
      consent_text_snapshot: consentText || null,
      submitted_ip_hash: ip_hash,
      submitted_user_agent: ua,
      status: 'pending',
    })

    if (error) {
      console.error('testimonial insert error', error)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('submit testimonial error', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
