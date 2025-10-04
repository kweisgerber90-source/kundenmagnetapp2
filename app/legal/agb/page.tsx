// app/legal/agb/page.tsx
import { BRAND } from '@/lib/constants'

export default function AGBPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Allgemeine Geschäftsbedingungen (AGB)</h1>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-xl font-semibold">§ 1 Geltungsbereich</h2>
          <p>
            (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend &quot;AGB&quot;) des{' '}
            {BRAND.owner}
            (nachfolgend &quot;Anbieter&quot;), gelten für alle Verträge über die Nutzung der
            SaaS-Plattform {BRAND.name}, die ein Verbraucher oder Unternehmer (nachfolgend
            &quot;Kunde&quot;) mit dem Anbieter abschließt.
          </p>
          <p>
            (2) Verbraucher im Sinne dieser AGB ist jede natürliche Person, die ein Rechtsgeschäft
            zu Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen
            beruflichen Tätigkeit zugerechnet werden können.
          </p>

          <h2 className="mt-6 text-xl font-semibold">§ 2 Vertragsschluss</h2>
          <p>
            (1) Die Darstellung der Dienstleistungen auf der Website stellt kein rechtlich bindendes
            Angebot, sondern eine Aufforderung zur Bestellung dar.
          </p>
          <p>
            (2) Durch die Registrierung und Auswahl eines Tarifs gibt der Kunde ein verbindliches
            Angebot zum Abschluss eines Nutzungsvertrags ab.
          </p>
          <p>
            (3) Der Anbieter kann das Angebot des Kunden innerhalb von 5 Werktagen annehmen durch
            Zusendung einer Auftragsbestätigung per E-Mail oder durch Freischaltung des Zugangs.
          </p>

          <h2 className="mt-6 text-xl font-semibold">§ 3 Leistungsumfang</h2>
          <p>
            (1) Der Anbieter stellt dem Kunden die Software {BRAND.name} als Software-as-a-Service
            (SaaS) zur Verfügung. Der genaue Funktionsumfang ergibt sich aus der aktuellen
            Leistungsbeschreibung auf der Website.
          </p>
          <p>
            (2) Die Software ermöglicht das Sammeln, Moderieren und Anzeigen von Kundenbewertungen.
          </p>
          <p>
            (3) Der Anbieter gewährleistet eine Verfügbarkeit der Server von 99% im Jahresmittel.
          </p>

          <h2 className="mt-6 text-xl font-semibold">§ 4 Preise und Zahlung</h2>
          <p>
            (1) Es gelten die zum Zeitpunkt der Bestellung gültigen Preise. Die Preise verstehen
            sich als Nettopreise zuzüglich der gesetzlichen Umsatzsteuer.
          </p>
          <p>(2) Die Zahlung erfolgt monatlich im Voraus per SEPA-Lastschrift oder Kreditkarte.</p>
          <p>(3) Der Kunde ist verpflichtet, die vereinbarten Gebühren rechtzeitig zu zahlen.</p>

          <h2 className="mt-6 text-xl font-semibold">§ 5 Vertragslaufzeit und Kündigung</h2>
          <p>(1) Der Vertrag wird auf unbestimmte Zeit geschlossen.</p>
          <p>
            (2) Der Vertrag kann von beiden Parteien mit einer Frist von einem Monat zum Monatsende
            gekündigt werden.
          </p>
          <p>(3) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.</p>
          <p>(4) Kündigungen bedürfen der Textform (E-Mail genügt).</p>

          <h2 className="mt-6 text-xl font-semibold">§ 6 Pflichten des Kunden</h2>
          <p>
            (1) Der Kunde ist verpflichtet, die ihm zur Verfügung gestellten Zugangsdaten
            vertraulich zu behandeln und vor dem Zugriff Dritter zu schützen.
          </p>
          <p>
            (2) Der Kunde stellt sicher, dass die von ihm eingestellten Inhalte keine Rechte Dritter
            verletzen und nicht gegen geltendes Recht verstoßen.
          </p>
          <p>
            (3) Der Kunde stellt den Anbieter von allen Ansprüchen Dritter frei, die auf einer
            rechtswidrigen Verwendung der Software durch den Kunden beruhen.
          </p>

          <h2 className="mt-6 text-xl font-semibold">§ 7 Haftung</h2>
          <p>(1) Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit.</p>
          <p>
            (2) Für leichte Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher
            Vertragspflichten (Kardinalpflichten) und begrenzt auf den vorhersehbaren,
            vertragstypischen Schaden.
          </p>
          <p>
            (3) Die Haftung für Datenverlust wird auf den typischen Wiederherstellungsaufwand
            beschränkt, der bei regelmäßiger und gefahrentsprechender Anfertigung von
            Sicherungskopien eingetreten wäre.
          </p>

          <h2 className="mt-6 text-xl font-semibold">§ 8 Datenschutz</h2>
          <p>
            (1) Der Anbieter verarbeitet personenbezogene Daten des Kunden zweckgebunden und gemäß
            den gesetzlichen Bestimmungen.
          </p>
          <p>
            (2) Die permanente Speicherung der Daten erfolgt auf Servern in Deutschland (Frankfurt).
          </p>
          <p>
            (3) Nähere Informationen zum Umgang mit Nutzerdaten finden sich in der
            Datenschutzerklärung.
          </p>

          <h2 className="mt-6 text-xl font-semibold">§ 9 Änderungen der AGB</h2>
          <p>
            (1) Der Anbieter behält sich vor, diese AGB zu ändern, sofern die Änderung unter
            Berücksichtigung der Interessen des Anbieters für den Kunden zumutbar ist.
          </p>
          <p>
            (2) Änderungen werden dem Kunden mindestens 6 Wochen vor Inkrafttreten per E-Mail
            mitgeteilt.
          </p>

          <h2 className="mt-6 text-xl font-semibold">§ 10 Schlussbestimmungen</h2>
          <p>
            (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
          </p>
          <p>(2) Ist der Kunde Kaufmann, ist Gerichtsstand der Sitz des Anbieters.</p>
          <p>
            (3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, berührt dies
            die Wirksamkeit der übrigen Bestimmungen nicht.
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
