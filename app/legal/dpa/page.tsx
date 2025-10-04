// app/legal/dpa/page.tsx
import { BRAND } from '@/lib/constants'

export default function DPAPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Auftragsverarbeitungsvertrag (AVV)</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-muted-foreground">
            Gemäß Art. 28 DSGVO zwischen dem Verantwortlichen (Kunde) und dem Auftragsverarbeiter (
            {BRAND.owner})
          </p>

          <h2 className="mt-8 text-xl font-semibold">§ 1 Gegenstand und Dauer der Verarbeitung</h2>
          <p>
            (1) Gegenstand der Auftragsverarbeitung ist die Verarbeitung personenbezogener Daten im
            Rahmen der Nutzung der SaaS-Plattform {BRAND.name}.
          </p>
          <p>
            (2) Die Dauer der Verarbeitung entspricht der Laufzeit des Hauptvertrags zwischen den
            Parteien.
          </p>

          <h2 className="mt-6 text-xl font-semibold">§ 2 Art und Zweck der Datenverarbeitung</h2>
          <p>
            (1) <strong>Art der Verarbeitung:</strong>
          </p>
          <ul>
            <li>Speicherung von Kundenbewertungen und Testimonials</li>
            <li>Verarbeitung von Kontaktdaten der Bewertenden</li>
            <li>Bereitstellung und Anzeige der Bewertungen</li>
            <li>Analytische Auswertung der Bewertungsdaten</li>
          </ul>

          <p>
            (2) <strong>Zweck der Verarbeitung:</strong>
          </p>
          <ul>
            <li>Sammlung und Verwaltung von Kundenbewertungen</li>
            <li>Bereitstellung der vereinbarten SaaS-Dienstleistungen</li>
            <li>Technische Systemverwaltung und -wartung</li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">
            § 3 Kategorien betroffener Personen und Daten
          </h2>
          <p>
            (1) <strong>Kategorien betroffener Personen:</strong>
          </p>
          <ul>
            <li>Kunden des Auftraggebers, die Bewertungen abgeben</li>
            <li>Nutzer der Bewertungsplattform</li>
            <li>Websitebesucher, die Bewertungen einsehen</li>
          </ul>

          <p>
            (2) <strong>Kategorien personenbezogener Daten:</strong>
          </p>
          <ul>
            <li>Name (optional)</li>
            <li>E-Mail-Adresse (optional)</li>
            <li>Bewertungstext und Sternenanzahl</li>
            <li>Zeitstempel der Bewertung</li>
            <li>IP-Adresse (temporär für Spam-Schutz)</li>
            <li>Technische Metadaten (Browser, Gerät)</li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">
            § 4 Technische und organisatorische Maßnahmen
          </h2>
          <p>
            Der Auftragsverarbeiter trifft folgende Maßnahmen zum Schutz personenbezogener Daten:
          </p>

          <h3 className="mt-4 text-lg font-semibold">Technische Maßnahmen:</h3>
          <ul>
            <li>SSL/TLS-Verschlüsselung aller Datenübertragungen</li>
            <li>Verschlüsselung der Daten in der Datenbank</li>
            <li>Regelmäßige Sicherheitsupdates der Systemkomponenten</li>
            <li>Firewalls und Intrusion Detection Systeme</li>
            <li>Tägliche automatisierte Backups</li>
            <li>Monitoring und Logging aller Systemzugriffe</li>
          </ul>

          <h3 className="mt-4 text-lg font-semibold">Organisatorische Maßnahmen:</h3>
          <ul>
            <li>Zutritts-, Zugangs- und Zugriffskontrolle</li>
            <li>Weitergabekontrolle und Eingabekontrolle</li>
            <li>Verfügbarkeitskontrolle und Trennungskontrolle</li>
            <li>Regelmäßige Schulung der Mitarbeiter</li>
            <li>Verpflichtung der Mitarbeiter auf das Datengeheimnis</li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">
            § 5 Berichtigung, Löschung und Sperrung von Daten
          </h2>
          <p>
            (1) Der Auftragsverarbeiter verarbeitet personenbezogene Daten ausschließlich im Rahmen
            der Weisungen des Verantwortlichen.
          </p>
          <p>
            (2) Weisungen zur Berichtigung, Löschung oder Sperrung von Daten werden unverzüglich
            umgesetzt.
          </p>
          <p>
            (3) Der Auftragsverarbeiter stellt geeignete technische Verfahren bereit, damit der
            Verantwortliche seine Informationspflichten gegenüber betroffenen Personen erfüllen
            kann.
          </p>

          <h2 className="mt-6 text-xl font-semibold">§ 6 Rechte betroffener Personen</h2>
          <p>
            Der Auftragsverarbeiter unterstützt den Verantwortlichen bei der Erfüllung seiner
            Pflichten zur Beantwortung von Anträgen betroffener Personen auf:
          </p>
          <ul>
            <li>Auskunft (Art. 15 DSGVO)</li>
            <li>Berichtigung (Art. 16 DSGVO)</li>
            <li>Löschung (Art. 17 DSGVO)</li>
            <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch (Art. 21 DSGVO)</li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">§ 7 Datenschutzbeauftragte</h2>
          <p>
            Bei Fragen zum Datenschutz können sich betroffene Personen an unseren
            Datenschutzbeauftragten wenden:
          </p>
          <p>
            <strong>Kontakt:</strong>
            <br />
            E-Mail: datenschutz@{BRAND.domain}
            <br />
            Post: {BRAND.owner}, {BRAND.address.street}, {BRAND.address.zip} {BRAND.address.city}
          </p>

          <h2 className="mt-6 text-xl font-semibold">§ 8 Meldung von Datenschutzverletzungen</h2>
          <p>
            (1) Der Auftragsverarbeiter meldet dem Verantwortlichen unverzüglich jede
            Datenschutzverletzung, die personenbezogene Daten betrifft.
          </p>
          <p>
            (2) Die Meldung erfolgt innerhalb von 24 Stunden nach Kenntniserlangung und enthält alle
            verfügbaren relevanten Informationen.
          </p>

          <h2 className="mt-6 text-xl font-semibold">§ 9 Nachweis der Datenschutz-Compliance</h2>
          <p>
            (1) Der Auftragsverarbeiter stellt dem Verantwortlichen auf Anfrage alle erforderlichen
            Informationen zum Nachweis der Einhaltung der Datenschutzbestimmungen zur Verfügung.
          </p>
          <p>
            (2) Der Auftragsverarbeiter ermöglicht und trägt zu Audits und Inspektionen bei, die vom
            Verantwortlichen oder einem vom Verantwortlichen beauftragten Prüfer durchgeführt
            werden.
          </p>

          <h2 className="mt-6 text-xl font-semibold">§ 10 Weitere Auftragsverarbeiter</h2>
          <p>
            (1) Der Auftragsverarbeiter ist berechtigt, weitere Auftragsverarbeiter (Subunternehmer)
            zu beauftragen.
          </p>
          <p>(2) Derzeit werden folgende Subunternehmer eingesetzt:</p>
          <ul>
            <li>
              <strong>Hosting:</strong> Hetzner Online GmbH (Deutschland)
            </li>
            <li>
              <strong>E-Mail-Versand:</strong> Amazon SES (EU-Region)
            </li>
            <li>
              <strong>Monitoring:</strong> Sentry.io (EU-Hosting)
            </li>
          </ul>
          <p>
            (3) Änderungen der Subunternehmer werden dem Verantwortlichen mindestens 30 Tage im
            Voraus mitgeteilt.
          </p>

          <h2 className="mt-6 text-xl font-semibold">§ 11 Internationale Datentransfers</h2>
          <p>
            (1) Eine Übermittlung personenbezogener Daten in Drittländer oder an internationale
            Organisationen findet grundsätzlich nicht statt.
          </p>
          <p>
            (2) Alle Daten werden ausschließlich auf Servern in Deutschland (Frankfurt am Main)
            verarbeitet und gespeichert.
          </p>

          <h2 className="mt-6 text-xl font-semibold">§ 12 Löschung und Rückgabe der Daten</h2>
          <p>
            (1) Nach Beendigung des Hauptvertrags löscht der Auftragsverarbeiter alle
            personenbezogenen Daten oder gibt diese an den Verantwortlichen zurück.
          </p>
          <p>
            (2) Die Löschung erfolgt sicher und unwiderruflich innerhalb von 30 Tagen nach
            Vertragsende.
          </p>
          <p>
            (3) Kopien oder Sicherungen werden ebenfalls gelöscht, es sei denn, eine gesetzliche
            Aufbewahrungspflicht besteht.
          </p>

          <p className="mt-8 text-sm text-muted-foreground">
            Stand: {new Date().toLocaleDateString('de-DE')}
            <br />
            {BRAND.name}
            <br />
            {BRAND.owner}
            <br />
            {BRAND.email.support}
          </p>
        </div>
      </div>
    </div>
  )
}
