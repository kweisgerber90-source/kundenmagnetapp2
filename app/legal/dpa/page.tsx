// app/legal/dpa/page.tsx
// Vereinfachter AVV (Art. 28 DSGVO), EU-only – Brevo statt AWS SES

import { BRAND } from '@/lib/constants'

export default function DPAPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Auftragsverarbeitungsvertrag (AVV)</h1>

        <div className="prose prose-gray max-w-none">
          <p>
            Dieser Muster-AVV (Art. 28 DSGVO) regelt die Verarbeitung personenbezogener Daten im
            Rahmen der Nutzung von {BRAND.name}. Die Verarbeitung erfolgt ausschließlich innerhalb
            der Europäischen Union. Eine Übermittlung in Drittstaaten findet nicht statt.
          </p>

          <h2>1. Parteien</h2>
          <p>
            Verantwortlicher (Kunde); Auftragsverarbeiter: {BRAND.owner} ({BRAND.tradeName}),
            {BRAND.address.street}, {BRAND.address.zip} {BRAND.address.city}, Deutschland.
          </p>

          <h2>2. Gegenstand, Dauer, Art und Zweck der Verarbeitung</h2>
          <p>
            Gegenstand ist die Bereitstellung von {BRAND.name} als SaaS (Erhebung, Speicherung,
            Anzeige und Moderation von Testimonials; Versand transaktionaler E-Mails via Brevo). Die
            Dauer entspricht der Vertragslaufzeit und ggf. gesetzlichen Aufbewahrungspflichten.
          </p>

          <h2>3. Technische und organisatorische Maßnahmen (TOMs)</h2>
          <ul>
            <li>
              TLS-Verschlüsselung, Zugriffskontrollen, Protokollierung sicherheitsrelevanter
              Ereignisse
            </li>
            <li>Regelmäßige Updates & Backups, Least-Privilege-Prinzip</li>
            <li>IP-Hashing mit Pepper; keine Speicherung von Roh-IP-Adressen</li>
          </ul>

          <h2>4. Unterauftragsverarbeiter (EU)</h2>
          <ul>
            <li>Hosting/Frontend: Vercel (EU – Region Frankfurt für Serverless-Funktionen)</li>
            <li>Datenbank/Storage/Auth: Supabase (Frankfurt, eu-central-1)</li>
            <li>Domain & Basis-E-Mail-Infrastruktur: ALL-INKL.COM (Deutschland)</li>
            <li>Transaktionaler Mailversand: Brevo (EU-Datenverarbeitung, Server in der EU)</li>
            <li>Zahlungsabwicklung: Stripe (EU-Niederlassungen, Steuerfunktionen/VAT)</li>
          </ul>

          <h2>5. Löschung & Rückgabe</h2>
          <p>
            Nach Vertragsende werden personenbezogene Daten gelöscht, sofern keine gesetzlichen
            Aufbewahrungspflichten entgegenstehen. Export auf Anfrage (DSAR) ist jederzeit möglich.
          </p>

          <h2>6. Betroffenenrechte & Unterstützung</h2>
          <p>
            {BRAND.name} unterstützt den Verantwortlichen bei Auskunft, Berichtigung, Löschung,
            Datenübertragbarkeit und Widerspruch. Endpunkte: /api/gdpr/export und /api/gdpr/delete.
          </p>

          <h2>7. Datenschutzverletzungen</h2>
          <p>
            Sicherheitsvorfälle werden gemäß Art. 33/34 DSGVO behandelt. Kontakt:{' '}
            {BRAND.email.support}.
          </p>

          <h2>8. Schlussbestimmungen</h2>
          <p>
            Änderungen bedürfen der Schriftform. Es gilt deutsches Recht. Gerichtsstand ist der Sitz
            des Auftragsverarbeiters.
          </p>
        </div>
      </div>
    </div>
  )
}
