// lib/email/templates/welcome.ts
/**
 * E-Mail-Template: Willkommens-E-Mail nach Registrierung
 * Sprache: Deutsch
 *
 * Verwendung:
 * - Nach erfolgreicher Registrierung
 * - Onboarding-Informationen
 * - Link zum Dashboard
 */

export interface WelcomeEmailParams {
  userName: string
  userEmail: string
  dashboardUrl: string
}

export function getWelcomeEmailTemplate(params: WelcomeEmailParams): {
  subject: string
  html: string
  text: string
} {
  const { userName, dashboardUrl } = params

  const subject = 'Willkommen bei Kundenmagnetapp!'

  const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 100%;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #2563eb;">
                Kundenmagnetapp
              </h1>
              <p style="margin: 12px 0 0; font-size: 16px; color: #6b7280;">
                Kundenbewertungen sammeln und einbetten
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <p style="margin: 0 0 20px; font-size: 18px; line-height: 1.6; color: #1f2937; font-weight: 600;">
                Willkommen${userName ? `, ${userName}` : ''}!
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                Schön, dass Sie dabei sind! Mit Kundenmagnetapp können Sie ganz einfach Kundenbewertungen sammeln, moderieren und auf Ihrer Website einbetten.
              </p>
              
              <div style="background-color: #f0f9ff; border-left: 4px solid #2563eb; padding: 16px; margin: 24px 0; border-radius: 4px;">
                <p style="margin: 0 0 12px; font-size: 16px; font-weight: 600; color: #1e40af;">
                  🎉 14 Tage kostenlos testen
                </p>
                <p style="margin: 0; font-size: 14px; color: #1e40af;">
                  Keine Kreditkarte erforderlich. Jederzeit kündbar.
                </p>
              </div>
              
              <p style="margin: 24px 0 12px; font-size: 16px; font-weight: 600; color: #1f2937;">
                So starten Sie:
              </p>
              
              <table cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 8px 0; vertical-align: top; width: 32px;">
                    <span style="display: inline-block; width: 24px; height: 24px; background-color: #2563eb; color: white; text-align: center; line-height: 24px; border-radius: 50%; font-weight: 600; font-size: 14px;">1</span>
                  </td>
                  <td style="padding: 8px 0; font-size: 15px; color: #4b5563;">
                    Erstellen Sie Ihre erste Kampagne
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; vertical-align: top;">
                    <span style="display: inline-block; width: 24px; height: 24px; background-color: #2563eb; color: white; text-align: center; line-height: 24px; border-radius: 50%; font-weight: 600; font-size: 14px;">2</span>
                  </td>
                  <td style="padding: 8px 0; font-size: 15px; color: #4b5563;">
                    Senden Sie Bewertungseinladungen an Ihre Kunden
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; vertical-align: top;">
                    <span style="display: inline-block; width: 24px; height: 24px; background-color: #2563eb; color: white; text-align: center; line-height: 24px; border-radius: 50%; font-weight: 600; font-size: 14px;">3</span>
                  </td>
                  <td style="padding: 8px 0; font-size: 15px; color: #4b5563;">
                    Moderieren Sie eingehende Bewertungen
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; vertical-align: top;">
                    <span style="display: inline-block; width: 24px; height: 24px; background-color: #2563eb; color: white; text-align: center; line-height: 24px; border-radius: 50%; font-weight: 600; font-size: 14px;">4</span>
                  </td>
                  <td style="padding: 8px 0; font-size: 15px; color: #4b5563;">
                    Betten Sie das Widget auf Ihrer Website ein
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${dashboardUrl}" style="display: inline-block; padding: 14px 32px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Jetzt loslegen
                </a>
              </div>
              
              <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                Bei Fragen sind wir jederzeit für Sie da: 
                <a href="mailto:support@kundenmagnet-app.de" style="color: #2563eb; text-decoration: none;">support@kundenmagnet-app.de</a>
              </p>
              
              <p style="margin: 16px 0 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                Viel Erfolg!<br>
                Ihr Kundenmagnetapp-Team
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #9ca3af; text-align: center;">
                © ${new Date().getFullYear()} Kundenmagnetapp – Eibenweg 1, 97084 Würzburg<br>
                <a href="https://kundenmagnet-app.de/legal/impressum" style="color: #2563eb; text-decoration: none;">Impressum</a> | 
                <a href="https://kundenmagnet-app.de/legal/datenschutz" style="color: #2563eb; text-decoration: none;">Datenschutz</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()

  const text = `
Willkommen bei Kundenmagnetapp!

Hallo${userName ? ` ${userName}` : ''},

schön, dass Sie dabei sind! Mit Kundenmagnetapp können Sie ganz einfach Kundenbewertungen sammeln, moderieren und auf Ihrer Website einbetten.

🎉 14 Tage kostenlos testen
Keine Kreditkarte erforderlich. Jederzeit kündbar.

So starten Sie:
1. Erstellen Sie Ihre erste Kampagne
2. Senden Sie Bewertungseinladungen an Ihre Kunden
3. Moderieren Sie eingehende Bewertungen
4. Betten Sie das Widget auf Ihrer Website ein

Jetzt loslegen: ${dashboardUrl}

Bei Fragen sind wir jederzeit für Sie da: support@kundenmagnet-app.de

Viel Erfolg!
Ihr Kundenmagnetapp-Team

---
© ${new Date().getFullYear()} Kundenmagnetapp – Eibenweg 1, 97084 Würzburg
Impressum: https://kundenmagnet-app.de/legal/impressum
Datenschutz: https://kundenmagnet-app.de/legal/datenschutz
  `.trim()

  return { subject, html, text }
}
