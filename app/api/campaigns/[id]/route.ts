// /app/api/campaigns/[id]/route.ts
// GET/PATCH/DELETE für einzelne Kampagne
// 🔧 Neu: PATCH akzeptiert und validiert "status"; Updates nur für gesendete Felder
// ⚖️ Sicherheit: zusätzlich nach user_id filtern, damit Nutzer nur eigene Datensätze ändern

import { getEnv } from '@/lib/env'
import { getUser } from '@/lib/supabase/server'
import type { Campaign } from '@/lib/types/campaign'
import { updateCampaignSchema } from '@/lib/validations/campaign'
import { createClient, type PostgrestError } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const preferredRegion = ['fra1']

// GET /api/campaigns/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const env = getEnv()
    const supa = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL || '',
      env.SUPABASE_SERVICE_ROLE_KEY || '',
    )

    const { data, error } = await supa
      .from('campaigns')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ campaign: data as Campaign })
  } catch (err) {
    console.error('[campaigns/:id] GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/campaigns/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const json = await req.json()
    const parsed = updateCampaignSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.errors },
        { status: 400 },
      )
    }

    // 🔧 Nur Felder updaten, die gesendet wurden
    const payload: Partial<Pick<Campaign, 'name' | 'status'>> = {}
    if (typeof parsed.data.name !== 'undefined') payload.name = parsed.data.name
    if (typeof parsed.data.status !== 'undefined') payload.status = parsed.data.status

    if (Object.keys(payload).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }

    const env = getEnv()
    const supa = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL || '',
      env.SUPABASE_SERVICE_ROLE_KEY || '',
    )

    const { data, error } = await supa
      .from('campaigns')
      .update(payload)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error || !data) {
      const e = error as PostgrestError | null
      console.error('[campaigns/:id] PATCH error:', e)
      return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    }

    // optional Audit
    await supa.from('audit_log').insert({
      actor: user.id,
      action: 'update_campaign',
      target: data.id,
      meta: payload,
    })

    return NextResponse.json({ campaign: data as Campaign })
  } catch (err) {
    console.error('[campaigns/:id] PATCH error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/campaigns/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const env = getEnv()
    const supa = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL || '',
      env.SUPABASE_SERVICE_ROLE_KEY || '',
    )

    const { error } = await supa
      .from('campaigns')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('[campaigns/:id] DELETE error:', error)
      return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
    }

    // optional Audit
    await supa.from('audit_log').insert({
      actor: user.id,
      action: 'delete_campaign',
      target: params.id,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[campaigns/:id] DELETE error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
