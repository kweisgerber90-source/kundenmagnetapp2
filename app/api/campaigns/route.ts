// /app/api/campaigns/route.ts
// Kampagnen-API: Liste & Erstellen
// 🔧 Korrekturen: Keine "any"-Typen; Supabase-Fehler typisiert; Mapping streng getypt

import { getEnv } from '@/lib/env'
import { getUser } from '@/lib/supabase/server'
import type { Campaign } from '@/lib/types/campaign'
import { createCampaignSchema } from '@/lib/validations/campaign'
import { createClient, type PostgrestError } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const preferredRegion = ['fra1']

// GET /api/campaigns – Liste aller Kampagnen des Users
export async function GET(_req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const env = getEnv()
    const supa = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL || '',
      env.SUPABASE_SERVICE_ROLE_KEY || '',
    )

    const { data, error } = await supa
      .from('campaigns')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      // 🔎 Protokolliert den genauen Fehler von PostgREST
      console.error('[campaigns] fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 })
    }

    // 🔧 Strenges Mapping statt (c: any)
    const campaigns = (data ?? []) as unknown as Campaign[]
    const campaignsWithStats = campaigns.map((c) => ({
      ...c,
      testimonial_count: 0, // bis Aggregation vorhanden ist
    }))

    return NextResponse.json({ campaigns: campaignsWithStats })
  } catch (err) {
    console.error('[campaigns] GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/campaigns – Neue Kampagne erstellen
export async function POST(req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validation = createCampaignSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 },
      )
    }

    const { name, slug } = validation.data

    const env = getEnv()
    const supa = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL || '',
      env.SUPABASE_SERVICE_ROLE_KEY || '',
    )

    // Plan-Limit prüfen
    const { data: limitOk, error: limitErr } = await supa.rpc('check_plan_limit', {
      p_user_id: user.id,
      p_limit_type: 'campaigns',
    })

    if (limitErr || !limitOk) {
      return NextResponse.json(
        { error: 'Campaign limit reached. Please upgrade your plan.' },
        { status: 403 },
      )
    }

    const { data, error: createErr } = await supa
      .from('campaigns')
      .insert({
        user_id: user.id,
        name,
        slug: slug ?? null, // 🔧 null statt leerer String
        status: 'active',
      })
      .select()
      .single()

    if (createErr || !data) {
      const e = createErr as PostgrestError | null
      console.error('[campaigns] create error:', e)

      // 🔒 Unique-Verletzung (z. B. slug unique)
      if (e?.code === '23505') {
        return NextResponse.json(
          { error: 'Eine Kampagne mit diesem Slug existiert bereits' },
          { status: 409 },
        )
      }

      return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 })
    }

    // Audit-Log (Fehler hier nicht blockierend)
    await supa.from('audit_log').insert({
      actor: user.id,
      action: 'create_campaign',
      target: data.id,
      meta: { name: data.name, slug: data.slug },
    })

    return NextResponse.json({ campaign: data }, { status: 201 })
  } catch (err) {
    console.error('[campaigns] POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
