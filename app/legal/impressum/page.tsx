// app/legal/impressum/page.tsx
import { BRAND } from '@/lib/constants'

export default function ImpressumPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Impressum</h1>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-xl font-semibold">Angaben gemäß § 5 TMG</h2>
          <p>
            {BRAND.legalForm}
            <br />
            {BRAND.owner}
            <br />
            {BRAND.address.street}
            <br />
            {BRAND.address.zip} {BRAND.address.city}
            <br />
            {BRAND.address.country}
          </p>

          <h2 className="mt-6 text-xl font-semibold">Kontakt</h2>
          <p>
            Telefon: {BRAND.phone}
            <br />
            E-Mail: {BRAND.email.support}
          </p>

          <h2 className="mt-6 text-xl font-semibold">Umsatzsteuer-ID</h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
            <br />
            (Wird nach Beantragung ergänzt)
          </p>

          <h2 className="mt-6 text-xl font-semibold">
            Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
          </h2>
          <p>
            {BRAND.owner}
            <br />
            {BRAND.address.street}
            <br />
            {BRAND.address.zip} {BRAND.address.city}
          </p>

          <h2 className="mt-6 text-xl font-semibold">Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
            https://ec.europa.eu/consumers/odr/. Unsere E-Mail-Adresse finden Sie oben im Impressum.
          </p>
          <p className="mt-2">
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>

          <h2 className="mt-6 text-xl font-semibold">Haftung für Inhalte</h2>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
            Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
            Tätigkeit hinweisen.
          </p>
          <p className="mt-2">
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
            allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch
            erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
            Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend
            entfernen.
          </p>

          <h2 className="mt-6 text-xl font-semibold">Haftung für Links</h2>
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
            Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr
            übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
            Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
            Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum
            Zeitpunkt der Verlinkung nicht erkennbar.
          </p>
          <p className="mt-2">
            Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
            Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
            Rechtsverletzungen werden wir derartige Links umgehend entfernen.
          </p>

          <h2 className="mt-6 text-xl font-semibold">Urheberrecht</h2>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
            dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
            der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
            Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind
            nur für den privaten, nicht kommerziellen Gebrauch gestattet.
          </p>
          <p className="mt-2">
            Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die
            Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche
            gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden,
            bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen
            werden wir derartige Inhalte umgehend entfernen.
          </p>

          <h2 className="mt-6 text-xl font-semibold">Datenschutz</h2>
          <p>
            Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten
            möglich. Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name,
            Anschrift oder E-Mail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf
            freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an
            Dritte weitergegeben.
          </p>
          <p className="mt-2">
            Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation
            per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem
            Zugriff durch Dritte ist nicht möglich.
          </p>
          <p className="mt-2">
            Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten durch
            Dritte zur Übersendung von nicht ausdrücklich angeforderter Werbung und
            Informationsmaterialien wird hiermit ausdrücklich widersprochen. Die Betreiber der
            Seiten behalten sich ausdrücklich rechtliche Schritte im Falle der unverlangten
            Zusendung von Werbeinformationen, etwa durch Spam-Mails, vor.
          </p>

          <p className="mt-8 text-sm text-muted-foreground">
            Stand: {new Date().toLocaleDateString('de-DE')}
          </p>
        </div>
      </div>
    </div>
  )
}
