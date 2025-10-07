import { hashIP } from '@/lib/security-utils'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const preferredRegion = ['fra1']

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase configuration')
    return NextResponse.json({ error: 'Service configuration error' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  try {
    const { categories, consentText, consentGiven } = await request.json()

    if (!categories || typeof consentGiven !== 'boolean' || !consentText) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Optional: try to resolve user (if token provided)
    let userId: string | null = null
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice('Bearer '.length)
      const { data } = await supabase.auth.getUser(token)
      userId = data.user?.id ?? null
    }

    // IP best-effort (x-forwarded-for may contain list; take first)
    const fwd = request.headers.get('x-forwarded-for') || ''
    const ip = (request.ip || fwd.split(',')[0] || 'unknown').trim()
    const ipHash = await hashIP(ip)

    const userAgent = request.headers.get('user-agent') ?? 'unknown'

    const { error } = await supabase.from('consent_log').insert({
      user_id: userId,
      ip_hash: ipHash,
      user_agent: userAgent,
      consent_given: consentGiven,
      categories,
      consent_text_snapshot: consentText,
    })

    if (error) {
      console.error('Failed to log consent:', error)
      return NextResponse.json({ error: 'Failed to log consent' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Consent log error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
