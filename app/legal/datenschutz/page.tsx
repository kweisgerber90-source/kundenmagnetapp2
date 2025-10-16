// Hinweis (DE):
// - Diese Erklärung nennt Verantwortliche Stelle, Hosting/Infra (Vercel + ALL-INKL), Logfiles, Cookies,
//   Zahlungsabwicklung (Stripe) und transaktionalen Mailversand (AWS SES eu-central-1).
// - Formulierungen sind bewusst klar und praxisnah gehalten (ausreichend für Trust & Safety / DSGVO-Transparenz).

import { BRAND } from '@/lib/constants'

export default function DatenschutzPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Datenschutzerklärung</h1>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-xl font-semibold">1. Datenschutz auf einen Blick</h2>
          <p>
            Die folgenden Hinweise geben einen Überblick darüber, was mit Ihren personenbezogenen
            Daten passiert, wenn Sie unsere Website besuchen. Personenbezogene Daten sind alle
            Daten, mit denen Sie persönlich identifiziert werden können.
          </p>

          <h2 className="mt-6 text-xl font-semibold">2. Verantwortliche Stelle</h2>
          <p>
            <strong>{BRAND.tradeName}</strong>
            <br />
            Inhaber: {BRAND.owner}
            <br />
            {BRAND.address.street}, {BRAND.address.zip} {BRAND.address.city},{' '}
            {BRAND.address.country}
            <br />
            Telefon: {BRAND.phone}
            <br />
            E-Mail: {BRAND.email.support}
          </p>

          <h2 className="mt-6 text-xl font-semibold">3. Hosting & Infrastruktur</h2>
          <p>
            Die Bereitstellung der Website erfolgt über <strong>Vercel Inc.</strong>{' '}
            (EU-Bereitstellung mit automatischem TLS). Domain- und E-Mail-Dienste werden über{' '}
            <strong>ALL-INKL.COM – Neue Medien Münnich</strong> (Deutschland) betrieben. Die
            Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
            Interesse an einer sicheren und effizienten Bereitstellung).
          </p>

          <h2 className="mt-6 text-xl font-semibold">4. Server-Log-Dateien</h2>
          <p>
            Der Provider erhebt und speichert automatisch Informationen in Server-Log-Dateien (z. B.
            Browsertyp/-version, verwendetes Betriebssystem, Referrer-URL, Hostname des zugreifenden
            Rechners, Uhrzeit der Serveranfrage, IP-Adresse – ggf. anonymisiert). Rechtsgrundlage:
            Art. 6 Abs. 1 lit. f DSGVO.
          </p>

          <h2 className="mt-6 text-xl font-semibold">5. Cookies</h2>
          <p>
            Unsere Website verwendet Cookies. Sie können Ihren Browser so einstellen, dass Sie über
            das Setzen von Cookies informiert werden, Cookies nur im Einzelfall erlauben, die
            Annahme von Cookies für bestimmte Fälle oder generell ausschließen sowie das
            automatische Löschen beim Schließen des Browsers aktivieren.
          </p>

          <h2 className="mt-6 text-xl font-semibold">6. Zahlungsabwicklung</h2>
          <p>
            Für Zahlungen nutzen wir <strong>Stripe</strong>. Rechtsgrundlage: Art. 6 Abs. 1 lit. b
            DSGVO (Vertragsabwicklung). Details:{' '}
            <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer">
              https://stripe.com/de/privacy
            </a>
            .
          </p>

          <h2 className="mt-6 text-xl font-semibold">7. E-Mail-Versand (transaktional)</h2>
          <p>
            Für transaktionale E-Mails (z. B. Bestätigungen, Benachrichtigungen, Passwort-Reset)
            nutzen wir <strong>Amazon Web Services – Simple Email Service (AWS SES)</strong> in der
            Region <strong>eu-central-1 (Frankfurt)</strong>. AWS ist u. a. nach ISO
            27001/27017/27018 zertifiziert. Für unsere Domain sind SPF, DKIM und DMARC konfiguriert.
          </p>
          <p>
            Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem technisch
            einwandfreien und sicheren E-Mail-Versand). Nutzer können der weiteren Zusendung
            transaktionaler E-Mails jederzeit widersprechen oder ihr Nutzerkonto löschen; in diesem
            Fall werden personenbezogene Daten gemäß den gesetzlichen Vorgaben gelöscht.
          </p>

          <h2 className="mt-6 text-xl font-semibold">8. Speicherdauer</h2>
          <p>
            Sofern in dieser Erklärung nicht anders angegeben, speichern wir Daten nur so lange, wie
            es für den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungspflichten
            bestehen.
          </p>

          <h2 className="mt-6 text-xl font-semibold">9. Ihre Rechte</h2>
          <ul className="list-disc pl-6">
            <li>Auskunft (Art. 15 DSGVO)</li>
            <li>Berichtigung (Art. 16 DSGVO)</li>
            <li>Löschung (Art. 17 DSGVO)</li>
            <li>Einschränkung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch (Art. 21 DSGVO)</li>
            <li>Widerruf erteilter Einwilligungen (Art. 7 Abs. 3 DSGVO)</li>
          </ul>

          <p className="mt-8 text-sm text-muted-foreground">
            Stand: {new Date().toLocaleDateString('de-DE')}
          </p>
        </div>
      </div>
    </div>
  )
}
