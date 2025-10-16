// Hinweis (DE):
// - Vereinfachter AVV (Muster) nach Art. 28 DSGVO für die Website/Vertragsanbahnung.
// - Benennt Unterauftragsverarbeiter (Vercel, ALL-INKL, AWS SES, Stripe), TOMs und Löschung.

import { BRAND } from '@/lib/constants'

export default function DPAPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Auftragsverarbeitungsvertrag (AVV)</h1>

        <div className="prose prose-gray max-w-none">
          <p>
            Dieser Muster-AVV (Art. 28 DSGVO) regelt die Verarbeitung personenbezogener Daten
            zwischen dem Verantwortlichen (Kunde) und dem Auftragsverarbeiter {BRAND.tradeName}{' '}
            (Inhaber: {BRAND.owner}).
          </p>

          <h2>1. Gegenstand, Dauer, Art und Zweck</h2>
          <p>
            Verarbeitung von Daten im Rahmen der Nutzung der SaaS-Plattform {BRAND.name}{' '}
            (Speicherung, Verwaltung und Anzeige von Bewertungen). Dauer: Vertragslaufzeit.
          </p>

          <h2>2. Kategorien betroffener Personen und Daten</h2>
          <ul>
            <li>Kunden/Bewertende des Auftraggebers; Website-Besucher</li>
            <li>
              Name (optional), E-Mail (optional), Bewertungstext, Sterne, Zeitstempel, IP (temporär)
            </li>
          </ul>

          <h2>3. Technische und organisatorische Maßnahmen</h2>
          <ul>
            <li>TLS-Verschlüsselung, Firewalls, Monitoring/Logging</li>
            <li>Regelmäßige Updates & Backups, Zugriffs-/Zutritts-/Zugriffskontrollen</li>
          </ul>

          <h2>4. Unterauftragsverarbeiter</h2>
          <ul>
            <li>Frontend/Hosting: Vercel Inc. (EU-Bereitstellung)</li>
            <li>Domain & E-Mail-Infrastruktur: ALL-INKL.COM – Neue Medien Münnich (DE)</li>
            <li>Transaktionaler Mailversand: AWS Simple Email Service (eu-central-1, Frankfurt)</li>
            <li>Zahlungsabwicklung: Stripe, Inc. (sofern Zahlungsvorgänge stattfinden)</li>
          </ul>

          <h2>5. Rechte Betroffener & Unterstützung</h2>
          <p>
            Unterstützung bei Anfragen auf Auskunft, Berichtigung, Löschung, Einschränkung,
            Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO).
          </p>

          <h2>6. Löschung & Rückgabe</h2>
          <p>
            Nach Vertragsende Löschung oder Rückgabe aller personenbezogenen Daten binnen 30 Tagen,
            sofern keine gesetzlichen Pflichten entgegenstehen.
          </p>

          <p className="mt-8 text-sm text-muted-foreground">
            Stand: {new Date().toLocaleDateString('de-DE')} · Kontakt: {BRAND.email.support}
          </p>
        </div>
      </div>
    </div>
  )
}
