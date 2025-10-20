// lib/email/templates/review-invitation.ts
/**
 * E-Mail-Template: Einladung zur Bewertungsabgabe
 * Sprache: Deutsch
 *
 * Verwendung:
 * - Nach Kauf/Service-Abschluss
 * - Personalisiert mit Kundennamen
 * - Direkter Link zum Bewertungsformular
 */

export interface ReviewInvitationParams {
  customerName: string
  companyName: string
  reviewUrl: string
  campaignName?: string
}

export function getReviewInvitationTemplate(params: ReviewInvitationParams): {
  subject: string
  html: string
  text: string
} {
  const { customerName, companyName, reviewUrl, campaignName } = params

  const subject = `${companyName} – Ihre Meinung zählt!`

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
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #1f2937;">
                ${companyName}
              </h1>
              ${campaignName ? `<p style="margin: 8px 0 0; font-size: 14px; color: #6b7280;">${campaignName}</p>` : ''}
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                Hallo ${customerName},
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                vielen Dank für Ihr Vertrauen! Ihre Meinung ist uns wichtig und hilft anderen Kunden bei ihrer Entscheidung.
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                Würden Sie sich einen kurzen Moment Zeit nehmen, um Ihre Erfahrung mit uns zu teilen?
              </p>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${reviewUrl}" style="display: inline-block; padding: 14px 32px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Jetzt Bewertung abgeben
                </a>
              </div>
              
              <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                Es dauert nur wenige Minuten und Sie helfen uns damit enorm weiter.
              </p>
              
              <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                Herzliche Grüße<br>
                Ihr ${companyName}-Team
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #9ca3af; text-align: center;">
                Diese E-Mail wurde über <strong>Kundenmagnetapp</strong> versendet.<br>
                Falls Sie keine weiteren E-Mails erhalten möchten, können Sie sich <a href="${reviewUrl.replace('/r/', '/unsubscribe/')}" style="color: #2563eb; text-decoration: none;">hier abmelden</a>.
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
Hallo ${customerName},

vielen Dank für Ihr Vertrauen! Ihre Meinung ist uns wichtig und hilft anderen Kunden bei ihrer Entscheidung.

Würden Sie sich einen kurzen Moment Zeit nehmen, um Ihre Erfahrung mit uns zu teilen?

Bewertung abgeben: ${reviewUrl}

Es dauert nur wenige Minuten und Sie helfen uns damit enorm weiter.

Herzliche Grüße
Ihr ${companyName}-Team

---
Diese E-Mail wurde über Kundenmagnetapp versendet.
Falls Sie keine weiteren E-Mails erhalten möchten, können Sie sich hier abmelden: ${reviewUrl.replace('/r/', '/unsubscribe/')}
  `.trim()

  return { subject, html, text }
}
