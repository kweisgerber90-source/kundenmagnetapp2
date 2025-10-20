// app/api/brevo/notifications/route.ts
/**
 * Brevo Webhook Handler (EU)
 * Verarbeitet Events: delivered, bounce, complaint, unsubscribed, opened, clicked, blocked, invalid, deferred, error.
 * Absichert über BREVO_WEBHOOK_TOKEN (Bearer oder ?token=)
 */

import { getEnv } from '@/lib/env'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const preferredRegion = ['fra1']

function supa() {
  const env = getEnv()
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!)
}

function authOk(req: NextRequest, envToken?: string) {
  if (!envToken) return true // Falls kein Token gesetzt — kein Zwang
  const bearer = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  const qp = new URL(req.url).searchParams.get('token')
  return bearer === envToken || qp === envToken
}

async function updateStatusByMessageId(messageId: string, status: string) {
  if (!messageId) return
  await supa().from('email_sends').update({ status }).eq('message_id', messageId)
}

async function addUnsub(email: string, reason: string) {
  try {
    await supa().from('email_unsubscribes').insert({
      email: email.toLowerCase(),
      reason,
    })
  } catch {
    // still
  }
}

export async function POST(req: NextRequest) {
  try {
    const env = getEnv()
    if (!authOk(req, env.BREVO_WEBHOOK_TOKEN)) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    // Brevo kann einzelne Events oder Arrays liefern
    const events = Array.isArray(body) ? body : [body]

    for (const ev of events) {
      const event = String(ev.event || ev.type || '').toLowerCase()
      const email = String(ev.email || ev.recipient || ev.to || '').toLowerCase()
      const msgId = String(ev['message-id'] || ev.messageId || ev.message_id || '') || null
      const reason = String(ev.reason || ev.reasonMessage || ev.tag || '') || undefined

      switch (event) {
        case 'delivered':
          await updateStatusByMessageId(msgId!, 'delivered')
          break
        case 'bounce':
        case 'hard_bounce':
        case 'soft_bounce':
          await updateStatusByMessageId(msgId!, 'bounced')
          break
        case 'complaint':
        case 'spam':
          await updateStatusByMessageId(msgId!, 'complaint')
          await addUnsub(email, reason || 'complaint')
          break
        case 'unsubscribed':
        case 'unsubscribe':
          await updateStatusByMessageId(msgId!, 'unsubscribed')
          await addUnsub(email, reason || 'unsubscribed')
          break
        case 'blocked':
          await updateStatusByMessageId(msgId!, 'bounced')
          break
        case 'invalid':
        case 'error':
          await updateStatusByMessageId(msgId!, 'error')
          break
        case 'opened':
        case 'click':
        case 'clicked':
        case 'deferred':
        default:
          // Für diese Events aktuell kein Statuswechsel
          break
      }
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[Brevo Webhook] error', e)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
