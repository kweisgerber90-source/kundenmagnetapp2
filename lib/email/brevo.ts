// lib/email/brevo.ts
/**
 * Brevo Transactional Email Service
 * - Versendet einfache & Template-basierte E-Mails über @getbrevo/brevo
 * - Loggt Zustände in Postgres (email_sends)
 */

import { getEnv } from '@/lib/env'
import * as brevo from '@getbrevo/brevo'
import { createClient } from '@supabase/supabase-js'

// Helpers to safely extract fields from SDK responses without broad 'any'
function extractBody(resp: unknown): unknown {
  if (!resp) return resp
  // Some SDKs return { response: { body } } or { body } or raw object
  try {
    const r = resp as Record<string, unknown>
    if (r.body) return r.body
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((r as any).response?.body) return (r as any).response.body
    return resp
  } catch {
    return resp
  }
}

function getField<T>(obj: unknown, key: string): T | undefined {
  if (!obj || typeof obj !== 'object') return undefined
  return (obj as Record<string, unknown>)[key] as T | undefined
}

type SendSimpleArgs = {
  to: string
  subject: string
  html?: string
  text?: string
  tags?: string[]
}

type SendTemplateArgs = {
  to: string
  templateId: number
  params?: Record<string, unknown>
  tags?: string[]
}

function getSupabase(env = getEnv()) {
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!)
}

function getBrevoApi(env = getEnv()) {
  const api = new brevo.TransactionalEmailsApi()

  // Try to set basePath if SDK exposes it
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (api as any).basePath = env.BREVO_BASE_URL || 'https://api.brevo.com'
  } catch (e) {
    // ignore
  }

  // Try to set API key (method may differ between SDK versions)
  if (env.BREVO_API_KEY) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (api as any).setApiKey?.(brevo.TransactionalEmailsApiApiKeys.apiKey, env.BREVO_API_KEY)
    } catch (e) {
      // ignore
    }
  }

  return api
}

function parseSender(senderRaw: string): { name: string; email: string } {
  const match = senderRaw?.match(/^(.*)<([^>]+)>$/)
  if (match) return { name: match[1].trim(), email: match[2].trim() }
  return { name: '', email: senderRaw }
}

async function logEmailSend(input: {
  toEmail: string
  template: string | null
  messageId: string | null
  status: 'queued' | 'sent' | 'delivered' | 'bounced' | 'complaint' | 'unsubscribed' | 'error'
}) {
  const env = getEnv()
  const supabase = getSupabase(env)
  try {
    await supabase.from('email_sends').insert({
      user_id: null,
      template: input.template,
      to_email: input.toEmail.toLowerCase(),
      message_id: input.messageId,
      status: input.status,
    })
  } catch {
    // logging must not throw
  }
}

export async function sendSimpleEmail({ to, subject, html, text, tags }: SendSimpleArgs) {
  const env = getEnv()
  const api = getBrevoApi(env)

  const sendSmtpEmail = new brevo.SendSmtpEmail()
  sendSmtpEmail.to = [{ email: to }]
  const sender = parseSender(env.BREVO_SENDER)
  // assign sender with a cast to avoid SDK type mismatches
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sse: any = sendSmtpEmail as any
  sse.sender = { name: sender.name || 'Kundenmagnetapp', email: sender.email }
  sendSmtpEmail.subject = subject
  if (html) sendSmtpEmail.htmlContent = html
  if (text) sendSmtpEmail.textContent = text
  if (env.BREVO_REPLY_TO) sendSmtpEmail.replyTo = { email: env.BREVO_REPLY_TO }
  if (tags?.length) sendSmtpEmail.tags = tags

  try {
    const resp = await api.sendTransacEmail(sendSmtpEmail)

    let messageId: string | null = null
    try {
      const body = extractBody(resp)
      const id =
        getField<number | string | undefined>(body, 'messageId') ??
        getField<number | string | undefined>(body, 'messageIdString') ??
        getField<number | string | undefined>(body, 'message_id')
      if (id !== undefined && id !== null) messageId = String(id)
    } catch (e) {
      messageId = null
    }

    await logEmailSend({ toEmail: to, template: 'simple_email', messageId, status: 'sent' })

    return { success: true, messageId }
  } catch (error) {
    await logEmailSend({ toEmail: to, template: 'simple_email', messageId: null, status: 'error' })
    throw error
  }
}

export async function sendTemplateEmail({ to, templateId, params, tags }: SendTemplateArgs) {
  const env = getEnv()
  const api = getBrevoApi(env)

  const sendSmtpEmail = new brevo.SendSmtpEmail()
  sendSmtpEmail.to = [{ email: to }]
  const sender = parseSender(env.BREVO_SENDER)
  // assign sender and templateId using casts to handle SDK typings
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sse2: any = sendSmtpEmail as any
  sse2.sender = { name: sender.name || 'Kundenmagnetapp', email: sender.email }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sse2.templateId = templateId
  if (params) sendSmtpEmail.params = params
  if (env.BREVO_REPLY_TO) sendSmtpEmail.replyTo = { email: env.BREVO_REPLY_TO }
  if (tags?.length) sendSmtpEmail.tags = tags

  try {
    const resp = await api.sendTransacEmail(sendSmtpEmail)

    let messageId: string | null = null
    try {
      const body = extractBody(resp)
      const id =
        getField<number | string | undefined>(body, 'messageId') ??
        getField<number | string | undefined>(body, 'messageIdString') ??
        getField<number | string | undefined>(body, 'message_id')
      if (id !== undefined && id !== null) messageId = String(id)
    } catch (e) {
      messageId = null
    }

    await logEmailSend({
      toEmail: to,
      template: `template_${templateId}`,
      messageId,
      status: 'sent',
    })

    return { success: true, messageId }
  } catch (error) {
    await logEmailSend({
      toEmail: to,
      template: `template_${templateId}`,
      messageId: null,
      status: 'error',
    })
    throw error
  }
}

export async function addUnsubscribe(email: string, reason?: string) {
  const env = getEnv()
  const supabase = getSupabase(env)
  try {
    await supabase
      .from('email_unsubscribes')
      .insert({ email: email.toLowerCase(), reason: reason || 'user_request' })
  } catch {
    // noop
  }
}

export async function brevoPing(): Promise<boolean> {
  try {
    const env = getEnv()
    void getBrevoApi(env)
    return true
  } catch {
    return false
  }
}
