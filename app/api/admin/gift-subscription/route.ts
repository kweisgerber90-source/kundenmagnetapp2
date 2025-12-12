// /app/api/admin/gift-subscription/route.ts
import { requireAdmin } from '@/lib/auth/admin'
import { createServiceClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const giftSubscriptionSchema = z.object({
  userId: z.string().uuid('Ungültige User-ID'),
  months: z.number().int().min(1).max(36, 'Maximal 36 Monate erlaubt'),
})

// ← NEU: Type Definitions hinzufügen
type ProfileRow = {
  id: string
  email: string
  name: string | null
}

type AuditLogEntry = {
  actor: string
  action: string
  target: string
  meta: {
    months: number
    granted_to_email: string
    granted_to_name: string | null
    timestamp: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin()

    const body = await request.json()
    const validation = giftSubscriptionSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validierungsfehler',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const { userId, months } = validation.data

    const supabase = createServiceClient()

    // ← Type Assertion hinzufügen
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, name')
      .eq('id', userId)
      .single<ProfileRow>() // ← HINZUGEFÜGT

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User nicht gefunden' }, { status: 404 })
    }

    // ← Type Assertion für RPC
    // @ts-expect-error - RPC-Funktion grant_free_months nicht in generierten Types
    const { data: result, error: rpcError } = await supabase.rpc('grant_free_months', {
      p_user_id: userId,
      p_months: months,
    })

    if (rpcError) {
      console.error('RPC grant_free_months Fehler:', rpcError)
      return NextResponse.json({ error: 'RPC-Fehler: ' + rpcError.message }, { status: 500 })
    }

    if (!result) {
      return NextResponse.json(
        { error: 'Berechtigung verweigert (Service Role erforderlich)' },
        { status: 403 },
      )
    }

    // ← Type Assertion für audit_log
    // @ts-expect-error - audit_log Tabelle nicht in generierten Types
    await supabase.from('audit_log').insert({
      actor: admin.userId,
      action: 'admin_grant_gift_subscription',
      target: userId,
      meta: {
        months,
        granted_to_email: profile.email,
        granted_to_name: profile.name,
        timestamp: new Date().toISOString(),
      } satisfies AuditLogEntry['meta'],
    })

    return NextResponse.json({
      success: true,
      message: `${months} Monate erfolgreich an ${profile.email} vergeben`,
      data: {
        userId,
        months,
        email: profile.email,
        name: profile.name,
      },
    })
  } catch (error) {
    console.error('Gift Subscription Fehler:', error)

    if (error instanceof Error) {
      if (error.message === 'Nicht authentifiziert') {
        return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
      }
      if (error.message === 'Admin-Rechte erforderlich') {
        return NextResponse.json({ error: 'Admin-Rechte erforderlich' }, { status: 403 })
      }
    }

    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}

export async function GET(_request: NextRequest) {
  try {
    await requireAdmin()

    const supabase = createServiceClient()

    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select(
        `
        id,
        user_id,
        plan_name,
        status,
        plan_override,
        created_at,
        updated_at,
        profiles:user_id (
          email,
          name
        )
      `,
      )
      .not('plan_override', 'is', null)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Fehler beim Laden der Gift-Subscriptions:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ subscriptions })
  } catch (error) {
    console.error('Gift Subscription Liste Fehler:', error)

    if (error instanceof Error) {
      if (error.message === 'Nicht authentifiziert') {
        return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
      }
      if (error.message === 'Admin-Rechte erforderlich') {
        return NextResponse.json({ error: 'Admin-Rechte erforderlich' }, { status: 403 })
      }
    }

    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}
