// app/api/brevo/notifications/route.ts
/**
 * Brevo Webhook Handler
 *
 * Empfängt Webhooks von Brevo für:
 * - Bounces (hard/soft)
 * - Spam-Complaints
 * - Unsubscribes
 *
 * Webhook URL: https://kundenmagnet-app.de/api/brevo/notifications
 *
 * Brevo Webhook Setup:
 * 1. Gehe zu https://app.brevo.com/settings/webhooks
 * 2. Erstelle neuen Webhook
 * 3. URL: https://kundenmagnet-app.de/api/brevo/notifications
 * 4. Events auswählen: hard_bounce, soft_bounce, spam, unsubscribe
 * 5. Optional: Webhook Secret für zusätzliche Sicherheit
 *
 * WICHTIG: Brevo sendet JSON im Body, kein SNS-Format wie AWS
 */

import { getEnv } from '@/lib/env'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const env = getEnv()
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL || '',
  env.SUPABASE_SERVICE_ROLE_KEY || '',
)

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const preferredRegion = 'fra1'

/**
 * POST Handler für Brevo Webhooks
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Brevo Webhook Events haben folgende Struktur:
    // {
    //   "event": "hard_bounce" | "soft_bounce" | "spam" | "unsubscribe",
    //   "email": "user@example.com",
    //   "id": 123,
    //   "date": "2025-10-19 12:00:00",
    //   "message-id": "<...@smtp-relay.brevo.com>",
    //   "reason": "...",
    //   ...
    // }

    const { event, email, reason } = body

    if (!email) {
      return NextResponse.json({ error: 'No email provided' }, { status: 400 })
    }

    // Event-Typ verarbeiten
    switch (event) {
      case 'hard_bounce':
      case 'soft_bounce':
        await handleBounce(email, event, reason)
        break

      case 'spam':
        await handleComplaint(email, reason)
        break

      case 'unsubscribe':
      case 'list_addition':
        await handleUnsubscribe(email, reason)
        break

      case 'request':
      case 'delivered':
      case 'unique_opened':
      case 'opened':
      case 'click':
        // Diese Events können ignoriert werden (optional: Analytics)
        break

      default:
        // Unbekannter Event-Typ - trotzdem 200 zurückgeben
        break
    }

    return NextResponse.json({ success: true, event })
  } catch (error) {
    // Fehler loggen aber trotzdem 200 zurückgeben
    // (sonst versucht Brevo immer wieder zu senden)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * Handle Bounce (hard oder soft)
 */
async function handleBounce(email: string, type: string, reason?: string) {
  try {
    // Update email_sends status
    await supabase
      .from('email_sends')
      .update({ status: 'bounced' })
      .eq('to_email', email)
      .order('created_at', { ascending: false })
      .limit(1)

    // Bei Hard Bounce: auf Unsubscribe-Liste setzen
    if (type === 'hard_bounce') {
      await supabase.from('email_unsubscribes').upsert(
        {
          email: email.toLowerCase(),
          reason: `hard_bounce: ${reason || 'unknown'}`,
          created_at: new Date().toISOString(),
        },
        {
          onConflict: 'email',
        },
      )
    }
  } catch (error) {
    // Fehler stillschweigend ignorieren
    // (Webhook sollte immer 200 zurückgeben)
  }
}

/**
 * Handle Spam Complaint
 */
async function handleComplaint(email: string, reason?: string) {
  try {
    // Update email_sends status
    await supabase
      .from('email_sends')
      .update({ status: 'complaint' })
      .eq('to_email', email)
      .order('created_at', { ascending: false })
      .limit(1)

    // Auf Unsubscribe-Liste setzen
    await supabase.from('email_unsubscribes').upsert(
      {
        email: email.toLowerCase(),
        reason: `spam_complaint: ${reason || 'unknown'}`,
        created_at: new Date().toISOString(),
      },
      {
        onConflict: 'email',
      },
    )
  } catch (error) {
    // Fehler stillschweigend ignorieren
  }
}

/**
 * Handle Unsubscribe
 */
async function handleUnsubscribe(email: string, reason?: string) {
  try {
    await supabase.from('email_unsubscribes').upsert(
      {
        email: email.toLowerCase(),
        reason: reason || 'user_unsubscribe',
        created_at: new Date().toISOString(),
      },
      {
        onConflict: 'email',
      },
    )
  } catch (error) {
    // Fehler stillschweigend ignorieren
  }
}

/**
 * GET Handler (optional - zum Testen ob Route erreichbar ist)
 */
export async function GET() {
  return NextResponse.json({
    service: 'Brevo Webhook Handler',
    status: 'active',
    endpoint: '/api/brevo/notifications',
    supported_events: ['hard_bounce', 'soft_bounce', 'spam', 'unsubscribe'],
  })
}
