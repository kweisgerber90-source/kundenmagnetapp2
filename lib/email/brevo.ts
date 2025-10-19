// lib/email/brevo.ts
/**
 * Brevo Transactional Email Service
 *
 * Ersetzt AWS SES durch Brevo API (EU-Server: api.brevo.com)
 *
 * Features:
 * - Transaktionale E-Mails (SimpleEmail)
 * - Template-basierte E-Mails
 * - Logging in `email_sends` Tabelle
 * - DSGVO-konform (Brevo nutzt EU-Server)
 *
 * Wichtig:
 * - BREVO_API_KEY muss in ENV gesetzt sein
 * - Sender muss in Brevo verifiziert sein
 * - Alle E-Mails werden über Frankfurt/EU-Rechenzentrum versendet
 */

import { getEnv } from '@/lib/env'
import * as brevo from '@getbrevo/brevo'
import { createClient } from '@supabase/supabase-js'

const env = getEnv()

// Brevo API Client initialisieren
const apiInstance = new brevo.TransactionalEmailsApi()
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, env.BREVO_API_KEY || '')

// Supabase Client für Logging
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL || '',
  env.SUPABASE_SERVICE_ROLE_KEY || '',
)

/**
 * Interface für einfache E-Mails
 */
interface SimpleEmailParams {
  to: string
  subject: string
  html: string
  text?: string
  replyTo?: string
}

/**
 * Interface für Template-basierte E-Mails
 */
interface TemplateEmailParams {
  to: string
  templateId: number
  params?: Record<string, string | number>
  replyTo?: string
}

/**
 * Sende eine einfache E-Mail
 */
export async function sendSimpleEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: SimpleEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail()

    // Sender aus ENV
    const [senderName, senderEmail] = parseSender(env.BREVO_SENDER)
    sendSmtpEmail.sender = { name: senderName, email: senderEmail }

    // Empfänger
    sendSmtpEmail.to = [{ email: to }]

    // Betreff & Inhalt
    sendSmtpEmail.subject = subject
    sendSmtpEmail.htmlContent = html
    if (text) {
      sendSmtpEmail.textContent = text
    }

    // Reply-To
    if (replyTo) {
      sendSmtpEmail.replyTo = { email: replyTo }
    } else if (env.BREVO_REPLY_TO) {
      sendSmtpEmail.replyTo = { email: env.BREVO_REPLY_TO }
    }

    // Versand
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail)

    // Brevo SDK Response ist kompliziert - extrahiere Message ID sicher
    let messageId = 'unknown'
    try {
      const resp = response as unknown
      let bodyCandidate: unknown = undefined
      if (resp && typeof resp === 'object') {
        const r = resp as Record<string, unknown>
        if ('body' in r) bodyCandidate = r.body
        else if ('response' in r && r.response && typeof r.response === 'object') {
          const rr = r.response as Record<string, unknown>
          if ('body' in rr) bodyCandidate = rr.body
        }
      }

      if (
        bodyCandidate &&
        typeof bodyCandidate === 'object' &&
        'messageId' in (bodyCandidate as Record<string, unknown>)
      ) {
        const mid = (bodyCandidate as Record<string, unknown>).messageId
        if (typeof mid === 'string' || typeof mid === 'number') {
          messageId = String(mid)
        }
      }
    } catch {
      // Fallback auf 'sent' wenn Message ID nicht extrahierbar
      messageId = 'sent'
    }

    // Logging
    await logEmailSend({
      toEmail: to,
      template: 'simple_email',
      messageId,
      status: 'sent',
    })

    return { success: true, messageId }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Logging
    await logEmailSend({
      toEmail: to,
      template: 'simple_email',
      messageId: null,
      status: 'failed',
    })

    return { success: false, error: errorMessage }
  }
}

/**
 * Sende eine Template-basierte E-Mail
 */
export async function sendTemplateEmail({
  to,
  templateId,
  params,
  replyTo,
}: TemplateEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail()

    // Sender aus ENV
    const [senderName, senderEmail] = parseSender(env.BREVO_SENDER)
    sendSmtpEmail.sender = { name: senderName, email: senderEmail }

    // Empfänger
    sendSmtpEmail.to = [{ email: to }]

    // Template ID
    sendSmtpEmail.templateId = templateId

    // Template-Parameter
    if (params) {
      sendSmtpEmail.params = params
    }

    // Reply-To
    if (replyTo) {
      sendSmtpEmail.replyTo = { email: replyTo }
    } else if (env.BREVO_REPLY_TO) {
      sendSmtpEmail.replyTo = { email: env.BREVO_REPLY_TO }
    }

    // Versand
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail)

    // Brevo SDK Response ist kompliziert - extrahiere Message ID sicher
    let messageId = 'unknown'
    try {
      const resp = response as unknown
      let bodyCandidate: unknown = undefined
      if (resp && typeof resp === 'object') {
        const r = resp as Record<string, unknown>
        if ('body' in r) bodyCandidate = r.body
        else if ('response' in r && r.response && typeof r.response === 'object') {
          const rr = r.response as Record<string, unknown>
          if ('body' in rr) bodyCandidate = rr.body
        }
      }

      if (
        bodyCandidate &&
        typeof bodyCandidate === 'object' &&
        'messageId' in (bodyCandidate as Record<string, unknown>)
      ) {
        const mid = (bodyCandidate as Record<string, unknown>).messageId
        if (typeof mid === 'string' || typeof mid === 'number') {
          messageId = String(mid)
        }
      }
    } catch {
      // Fallback auf 'sent' wenn Message ID nicht extrahierbar
      messageId = 'sent'
    }

    // Logging
    await logEmailSend({
      toEmail: to,
      template: `template_${templateId}`,
      messageId,
      status: 'sent',
    })

    return { success: true, messageId }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Logging
    await logEmailSend({
      toEmail: to,
      template: `template_${templateId}`,
      messageId: null,
      status: 'failed',
    })

    return { success: false, error: errorMessage }
  }
}

/**
 * Parse Sender String: "Name <email@domain.com>" → [Name, email@domain.com]
 */
function parseSender(sender: string): [string, string] {
  const match = sender.match(/^(.+?)\s*<(.+?)>$/)
  if (match) {
    return [match[1].trim(), match[2].trim()]
  }
  // Fallback: nur E-Mail
  return ['Kundenmagnetapp', sender.trim()]
}

/**
 * Logging in Supabase `email_sends` Tabelle
 */
async function logEmailSend({
  toEmail,
  template,
  messageId,
  status,
}: {
  toEmail: string
  template: string
  messageId: string | null
  status: 'sent' | 'failed'
}): Promise<void> {
  try {
    await supabase.from('email_sends').insert({
      to_email: toEmail,
      template,
      message_id: messageId,
      status,
      created_at: new Date().toISOString(),
    })
  } catch {
    // Fehler stillschweigend ignorieren
    // (Logging sollte E-Mail-Versand nicht blockieren)
  }
}

/**
 * Utility: Prüfe ob E-Mail auf Unsubscribe-Liste steht
 */
export async function isUnsubscribed(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('email_unsubscribes')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (error && error.code !== 'PGRST116') {
      return false
    }

    return !!data
  } catch {
    return false
  }
}

/**
 * Utility: Füge E-Mail zur Unsubscribe-Liste hinzu
 */
export async function addUnsubscribe(email: string, reason?: string): Promise<void> {
  try {
    await supabase.from('email_unsubscribes').insert({
      email: email.toLowerCase(),
      reason: reason || 'user_request',
      created_at: new Date().toISOString(),
    })
  } catch {
    // Fehler stillschweigend ignorieren
  }
}
