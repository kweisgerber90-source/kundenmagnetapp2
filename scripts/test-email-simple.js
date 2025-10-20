#!/usr/bin/env node
// scripts/test-email-simple.js
/**
 * Einfaches Test-Script für Brevo E-Mail-Versand (Pure JavaScript)
 *
 * Verwendung:
 *   node scripts/test-email-simple.js your-email@example.com
 */

require('dotenv').config({ path: '.env.local' })
const brevo = require('@getbrevo/brevo')

async function main() {
  const recipientEmail = process.argv[2]

  if (!recipientEmail) {
    console.error('❌ Fehler: Keine E-Mail-Adresse angegeben')
    console.log('Verwendung: node scripts/test-email-simple.js your-email@example.com')
    process.exit(1)
  }

  if (!process.env.BREVO_API_KEY) {
    console.error('❌ Fehler: BREVO_API_KEY nicht in .env.local gefunden')
    console.log('\n💡 Füge deinen Brevo API Key in .env.local hinzu:')
    console.log('   BREVO_API_KEY=xkeysib-your-key-here\n')
    process.exit(1)
  }

  console.log('\n📧 Teste Brevo E-Mail-Versand...\n')

  // API Client initialisieren
  const apiInstance = new brevo.TransactionalEmailsApi()
  apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY)

  // E-Mail-Objekt erstellen
  const sendSmtpEmail = new brevo.SendSmtpEmail()

  const fromEmail = process.env.BREVO_SENDER || 'Kundenmagnetapp <no-reply@kundenmagnet-app.de>'
  const [fromName, fromAddress] = fromEmail.includes('<')
    ? [
        fromEmail.substring(0, fromEmail.indexOf('<')).trim(),
        fromEmail.substring(fromEmail.indexOf('<') + 1, fromEmail.indexOf('>')),
      ]
    : ['Kundenmagnetapp', fromEmail]

  sendSmtpEmail.sender = { name: fromName, email: fromAddress }
  sendSmtpEmail.to = [{ email: recipientEmail }]
  sendSmtpEmail.subject = 'Test E-Mail von Kundenmagnetapp'

  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
    </head>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
      <h1 style="color: #2563eb;">Test erfolgreich! ✅</h1>
      <p>Diese E-Mail wurde erfolgreich über Brevo versendet.</p>
      <p><strong>Zeitstempel:</strong> ${new Date().toISOString()}</p>
      <hr style="margin: 20px 0;">
      <p style="color: #6b7280; font-size: 12px;">
        Kundenmagnetapp – Kundenbewertungen sammeln und einbetten
      </p>
    </body>
    </html>
  `

  sendSmtpEmail.textContent = `
Test erfolgreich!

Diese E-Mail wurde erfolgreich über Brevo versendet.

Zeitstempel: ${new Date().toISOString()}

---
Kundenmagnetapp – Kundenbewertungen sammeln und einbetten
  `

  if (process.env.BREVO_REPLY_TO) {
    sendSmtpEmail.replyTo = { email: process.env.BREVO_REPLY_TO }
  }

  sendSmtpEmail.tags = ['test']

  try {
    console.log(`📤 Sende Test-E-Mail an: ${recipientEmail}`)

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail)

    console.log('\n✅ E-Mail erfolgreich versendet!')
    console.log(`📨 Message ID: ${result.body.messageId}`)
    console.log('\n💡 Prüfe dein Postfach (auch Spam-Ordner!)')
    console.log('📊 Activity Log: https://app.brevo.com/logs\n')
  } catch (error) {
    console.error('\n❌ Fehler beim E-Mail-Versand:')
    console.error(error.response ? error.response.body : error.message)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Prüfe BREVO_API_KEY in .env.local')
    console.log('2. Prüfe Absender-Verifizierung: https://app.brevo.com/senders')
    console.log('3. Prüfe Brevo Logs: https://app.brevo.com/logs\n')
    process.exit(1)
  }
}

main()
