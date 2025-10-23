// API zum Absenden von Testimonials
// 🔧 Korrektur: extractIP nur mit undefined, nicht null; hashIP ebenfalls ohne null

import { getEnv } from '@/lib/env'
import { extractIP, hashIP } from '@/lib/security-utils'
import { submitTestimonialSchema } from '@/lib/validations/testimonial'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const preferredRegion = ['fra1']

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { slug, consentText, consent } = body

    if (!slug) return NextResponse.json({ error: 'Campaign slug required' }, { status: 400 })
    if (!consent || !consentText) {
      return NextResponse.json({ error: 'Datenschutz-Consent erforderlich' }, { status: 400 })
    }

    const validation = submitTestimonialSchema.safeParse({
      name: body.name,
      email: body.email ?? undefined,
      text: body.text,
      rating: body.rating ?? undefined,
      consent: true,
    })
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 },
      )
    }
    const { name, email, text, rating } = validation.data

    const env = getEnv()
    const supa = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL || '',
      env.SUPABASE_SERVICE_ROLE_KEY || '',
    )

    const { data: campaign, error: campErr } = await supa
      .from('campaigns')
      .select('id, status')
      .eq('slug', slug)
      .single()

    if (campErr || !campaign)
      return NextResponse.json({ error: 'Kampagne nicht gefunden' }, { status: 404 })
    if (campaign.status !== 'active')
      return NextResponse.json({ error: 'Diese Kampagne ist nicht aktiv' }, { status: 403 })

    // 🔧 nur undefined an extractIP / hashIP
    const ipRaw = extractIP(
      undefined,
      req.headers.get('x-forwarded-for') ?? undefined,
      req.headers.get('x-real-ip') ?? undefined,
    )
    const ip_hash = await hashIP(ipRaw ?? undefined)
    const ua = req.headers.get('user-agent') ?? undefined

    // Rate-Limit (10 Min) pro IP/E-Mail
    const { data: recent } = await supa
      .from('testimonials')
      .select('id, created_at')
      .eq('campaign_id', campaign.id)
      .or(
        [ip_hash ? `submitted_ip_hash.eq.${ip_hash}` : '', email ? `email.eq.${email}` : '']
          .filter(Boolean)
          .join(','),
      )
      .gte('created_at', new Date(Date.now() - 10 * 60 * 1000).toISOString())
      .limit(1)

    if (recent && recent.length > 0) {
      return NextResponse.json(
        { error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' },
        { status: 429 },
      )
    }

    const { error: insertErr } = await supa.from('testimonials').insert({
      campaign_id: campaign.id,
      name,
      email: email || null,
      text,
      rating: rating ?? null,
      consent_text_snapshot: consentText,
      submitted_ip_hash: ip_hash,
      submitted_user_agent: ua,
      status: 'pending',
    })
    if (insertErr) {
      console.error('Testimonial insert error:', insertErr)
      return NextResponse.json({ error: 'Fehler beim Speichern der Bewertung' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler'
    console.error('Submit testimonial error:', err)
    return NextResponse.json({ error: 'Serverfehler', details: message }, { status: 500 })
  }
}
