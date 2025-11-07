// /app/api/stripe/portal/route.ts
/**
 * 🏛️ Stripe Customer Portal Session erstellen
 * Öffnet das Stripe Portal für Self-Service Billing
 */

import { createPortalSession } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const preferredRegion = ['fra1']

export async function POST() {
  try {
    const supabase = await createClient()

    // Auth Check
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    // Profil mit Stripe Customer ID holen
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Kein Stripe-Kunde gefunden. Bitte wählen Sie zuerst einen Plan aus.' },
        { status: 400 },
      )
    }

    // Portal Session erstellen
    const session = await createPortalSession(profile.stripe_customer_id)

    // Audit Log
    await supabase.from('audit_log').insert({
      user_id: user.id,
      action: 'portal_session_created',
      resource_type: 'billing',
      details: {
        session_id: session.id,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Portal error:', error)

    return NextResponse.json(
      { error: 'Interner Server-Fehler beim Erstellen der Portal-Session' },
      { status: 500 },
    )
  }
}
