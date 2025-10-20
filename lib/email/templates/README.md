# E-Mail-Templates

Alle E-Mail-Templates für Kundenmagnetapp in deutscher Sprache.

## Verfügbare Templates

### 1. Willkommens-E-Mail (`welcome.ts`)

**Verwendung**: Nach erfolgreicher Registrierung

**Parameter**:

- `userName` - Name des Benutzers
- `userEmail` - E-Mail-Adresse
- `dashboardUrl` - Link zum Dashboard

**Beispiel**:

```typescript
import { getWelcomeEmailTemplate } from '@/lib/email/templates'
import { sendSimpleEmail } from '@/lib/email/brevo'

const template = getWelcomeEmailTemplate({
  userName: 'Klaus Weisgerber',
  userEmail: 'klaus@example.com',
  dashboardUrl: 'https://kundenmagnet-app.de/dashboard',
})

await sendSimpleEmail({
  to: 'klaus@example.com',
  subject: template.subject,
  html: template.html,
  text: template.text,
})
```

---

### 2. Bewertungseinladung (`review-invitation.ts`)

**Verwendung**: Kunden zur Bewertungsabgabe einladen

**Parameter**:

- `customerName` - Name des Kunden
- `companyName` - Name des Unternehmens
- `reviewUrl` - Link zum Bewertungsformular
- `campaignName` (optional) - Name der Kampagne

**Beispiel**:

```typescript
import { getReviewInvitationTemplate } from '@/lib/email/templates'
import { sendSimpleEmail } from '@/lib/email/brevo'

const template = getReviewInvitationTemplate({
  customerName: 'Max Mustermann',
  companyName: 'Testfirma GmbH',
  reviewUrl: 'https://kundenmagnet-app.de/r/test-kampagne',
  campaignName: 'Kundenzufriedenheit Q4 2025',
})

await sendSimpleEmail({
  to: 'max@example.com',
  subject: template.subject,
  html: template.html,
  text: template.text,
})
```

---

## Template-Struktur

Jedes Template liefert ein Objekt mit:

```typescript
{
  subject: string // E-Mail-Betreff
  html: string // HTML-Version
  text: string // Plain-Text-Version
}
```

**Wichtig**: Beide Versionen (HTML + Text) werden immer bereitgestellt für beste Kompatibilität.

---

## Neues Template erstellen

1. **Datei erstellen**: `lib/email/templates/your-template.ts`

1. **Interface definieren**:

```typescript
export interface YourTemplateParams {
  paramOne: string
  paramTwo: string
}
```

1. **Template-Funktion**:

```typescript
export function getYourTemplate(params: YourTemplateParams): {
  subject: string
  html: string
  text: string
} {
  const { paramOne, paramTwo } = params

  const subject = 'Dein Betreff'

  const html = `
    <!DOCTYPE html>
    <html lang="de">
    ...
    </html>
  `

  const text = `
    Plain-Text-Version
    ...
  `

  return { subject, html, text }
}
```

1. **Export in `index.ts`** hinzufügen

1. **Testen**:

```bash
pnpm tsx scripts/test-email.ts
```

---

## Design-Richtlinien

### HTML-Templates

- ✅ Verwende **Inline-CSS** (keine externen Stylesheets)
- ✅ Verwende **Tables** für Layout (beste E-Mail-Client-Kompatibilität)
- ✅ Maximale Breite: **600px**
- ✅ Responsive mit **Media Queries**
- ✅ System-Fonts verwenden (Arial, Helvetica, sans-serif)
- ✅ Farben aus Brand-Guidelines:
  - Primary: `#2563eb` (Blau)
  - Gray: `#6b7280`
  - Background: `#f5f5f5`

### Text-Templates

- ✅ **80 Zeichen pro Zeile** maximal
- ✅ Klare Struktur mit Leerzeilen
- ✅ Wichtige Informationen hervorheben mit `**Bold**`
- ✅ Links in Plain-Text schreiben: `https://...`

### Sprache

- ✅ **Deutsch** (formelle Anrede: "Sie")
- ✅ Klar und freundlich
- ✅ Kurze Sätze
- ✅ Aktive Sprache

---

## Testing

### 1. Lokaler Test mit Script

```bash
# TypeScript (empfohlen)
pnpm tsx scripts/test-email.ts your-email@example.com

# JavaScript (einfach)
node scripts/test-email-simple.js your-email@example.com
```

### 2. HTML-Preview

Öffne das HTML in einem Browser:

```typescript
const template = getWelcomeEmailTemplate({...})
console.log(template.html)
// → Kopiere Output und speichere als preview.html
```

### 3. E-Mail-Test-Tools

- **Litmus**: [Litmus](https://litmus.com) (paid)
- **Email on Acid**: [Email on Acid](https://www.emailonacid.com) (paid)
- **Mail Tester**: [Mail Tester](https://www.mail-tester.com) (free)

---

## Brevo-Integration

Templates werden über `sendSimpleEmail()` versendet:

```typescript
import { sendSimpleEmail } from '@/lib/email/brevo'

await sendSimpleEmail({
  to: 'user@example.com',
  subject: template.subject,
  html: template.html,
  text: template.text,
  replyTo: 'support@kundenmagnet-app.de', // optional
})
```

---

## Unsubscribe-Links

Jedes Template sollte einen Unsubscribe-Link enthalten:

```html
<!-- Im Footer -->
<a href="${unsubscribeUrl}">Abmelden</a>
```

**URL-Schema**: `/unsubscribe/{email-hash}`

---

## DSGVO-Konformität

Alle Templates sind DSGVO-konform:

- ✅ Klare Absender-Angabe
- ✅ Unsubscribe-Link vorhanden
- ✅ Datenschutz-Link im Footer
- ✅ Impressum-Link im Footer
- ✅ Keine Tracking-Pixel (ohne explizite Zustimmung)

---

## Weitere Ressourcen

- **Brevo Docs**: [Brevo Developers](https://developers.brevo.com/)
- **Email Design Guide**: [Email Design Guide](https://www.emaildesignguide.com/)
- **Can I Email**: [Can I Email](https://www.caniemail.com/) (CSS-Support prüfen)
- **HTML Email Boilerplate**: [HTML Email Boilerplate](https://htmlemailboilerplate.com/)

---

**Letzte Aktualisierung**: Oktober 2025
