// Hinweis (DE):
// - AGB in kompaktem SaaS-Format; in §8 wird auf Datenschutzerklärung verwiesen.
// - Formulierungen sind so gewählt, dass sie verständlich und branchenüblich sind.

import { BRAND } from '@/lib/constants'

export default function AGBPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Allgemeine Geschäftsbedingungen (AGB)</h1>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-xl font-semibold">§ 1 Geltungsbereich</h2>
          <p>
            (1) Diese Allgemeinen Geschäftsbedingungen („AGB“) des {BRAND.owner} (nachfolgend
            „Anbieter“) gelten für alle Verträge über die Nutzung der SaaS-Plattform {BRAND.name},
            die ein Verbraucher oder Unternehmer („Kunde“) mit dem Anbieter abschließt.
          </p>
          <p>
            (2) Verbraucher ist jede natürliche Person, die ein Rechtsgeschäft zu Zwecken
            abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen
            beruflichen Tätigkeit zugerechnet werden können.
          </p>

          <h2 className="mt-6 text-xl font-semibold">§ 2 Vertragsschluss</h2>
          <p>(1) Die Darstellung der Leistungen auf der Website ist kein bindendes Angebot.</p>
          <p>(2) Mit Registrierung/Tarifwahl gibt der Kunde ein verbindliches Angebot ab.</p>
          <p>
            (3) Annahme durch E-Mail-Bestätigung oder Freischaltung des Zugangs binnen 5 Werktagen.
          </p>

          <h2 className="mt-6 text-xl font-semibold">§ 3 Leistungsumfang</h2>
          <p>(1) Bereitstellung der Software {BRAND.name} als SaaS gemäß Leistungsbeschreibung.</p>
          <p>(2) Sammeln, Moderieren und Anzeigen von Kundenbewertungen.</p>
          <p>(3) Verfügbarkeit: 99 % im Jahresmittel.</p>

          <h2 className="mt-6 text-xl font-semibold">§ 4 Preise und Zahlung</h2>
          <p>(1) Es gelten die aktuellen Preise, zzgl. USt.</p>
          <p>(2) Zahlung monatlich im Voraus per SEPA-Lastschrift oder Kreditkarte.</p>
          <p>(3) Der Kunde zahlt fristgerecht die vereinbarten Entgelte.</p>

          <h2 className="mt-6 text-xl font-semibold">§ 5 Vertragslaufzeit und Kündigung</h2>
          <p>(1) Der Vertrag läuft auf unbestimmte Zeit.</p>
          <p>(2) Kündigungsfrist: 1 Monat zum Monatsende.</p>
          <p>(3) Außerordentliche Kündigung bleibt unberührt.</p>
          <p>(4) Textform genügt (E-Mail ausreichend).</p>

          <h2 className="mt-6 text-xl font-semibold">§ 6 Pflichten des Kunden</h2>
          <p>(1) Zugangsdaten vertraulich behandeln.</p>
          <p>(2) Inhalte dürfen keine Rechte Dritter verletzen oder gegen Recht verstoßen.</p>
          <p>(3) Freistellung des Anbieters bei Ansprüchen Dritter aus rechtswidriger Nutzung.</p>

          <h2 className="mt-6 text-xl font-semibold">§ 7 Haftung</h2>
          <p>(1) Unbeschränkte Haftung für Vorsatz und grobe Fahrlässigkeit.</p>
          <p>
            (2) Bei leichter Fahrlässigkeit nur bei Kardinalpflichten, begrenzt auf typischen
            Schaden.
          </p>
          <p>
            (3) Datenverlust: Haftung begrenzt auf Wiederherstellungsaufwand bei ordentlicher
            Sicherung.
          </p>

          <h2 className="mt-6 text-xl font-semibold">§ 8 Datenschutz</h2>
          <p>(1) Verarbeitung personenbezogener Daten gemäß gesetzlichen Vorgaben.</p>
          <p>(2) Dauerhafte Speicherung in Rechenzentren in Deutschland (Frankfurt).</p>
          <p>(3) Näheres in der Datenschutzerklärung.</p>

          <h2 className="mt-6 text-xl font-semibold">§ 9 Änderungen der AGB</h2>
          <p>(1) Zumutbare Änderungen bleiben vorbehalten.</p>
          <p>(2) Information mindestens 6 Wochen vor Inkrafttreten per E-Mail.</p>

          <h2 className="mt-6 text-xl font-semibold">§ 10 Schlussbestimmungen</h2>
          <p>(1) Es gilt deutsches Recht, UN-Kaufrecht ausgeschlossen.</p>
          <p>(2) Gerichtsstand für Kaufleute: Sitz des Anbieters.</p>
          <p>(3) Unwirksamkeit einzelner Klauseln berührt die übrigen nicht.</p>

          <p className="mt-8 text-sm text-muted-foreground">
            Stand: {new Date().toLocaleDateString('de-DE')}
            <br />
            {BRAND.name} · {BRAND.tradeName} · {BRAND.owner} · {BRAND.email.support}
          </p>
        </div>
      </div>
    </div>
  )
}
