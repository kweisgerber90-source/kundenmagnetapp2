// Hinweis (DE):
// - Dieses Impressum entspricht § 5 TMG und enthält einen Verantwortlichen nach § 55 Abs. 2 RStV.
// - Wir verwenden das Handels-/Markenzeichen (tradeName) + Inhaber, ohne das Wort „Einzelunternehmer“ auszugeben.

import { BRAND } from '@/lib/constants'

export default function ImpressumPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Impressum</h1>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-xl font-semibold">Angaben gemäß § 5 TMG</h2>
          <p>
            <strong>{BRAND.tradeName}</strong>
            <br />
            Inhaber: {BRAND.owner}
            <br />
            {BRAND.address.street}
            <br />
            {BRAND.address.zip} {BRAND.address.city}
            <br />
            {BRAND.address.country}
          </p>

          <p className="mt-4">
            Telefon: {BRAND.phone}
            <br />
            E-Mail: {BRAND.email.support}
          </p>

          <p className="mt-4">USt-IdNr.: (wird nach Beantragung ergänzt)</p>

          <h2 className="mt-8 text-xl font-semibold">
            Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
          </h2>
          <p>
            {BRAND.owner}
            <br />
            {BRAND.tradeName}
            <br />
            {BRAND.address.street}
            <br />
            {BRAND.address.zip} {BRAND.address.city}
          </p>

          <h2 className="mt-8 text-xl font-semibold">Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
              https://ec.europa.eu/consumers/odr/
            </a>
            . Unsere E-Mail-Adresse finden Sie oben im Impressum.
          </p>
          <p className="mt-2">
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>

          <h2 className="mt-8 text-xl font-semibold">Haftung für Inhalte</h2>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten
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

          <h2 className="mt-8 text-xl font-semibold">Haftung für Links</h2>
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
            Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr
            übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
            Betreiber verantwortlich. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht
            erkennbar.
          </p>
          <p className="mt-2">
            Eine permanente Kontrolle der verlinkten Seiten ist ohne konkrete Anhaltspunkte nicht
            zumutbar. Bei Bekanntwerden von Rechtsverletzungen entfernen wir derartige Links
            umgehend.
          </p>

          <p className="mt-8 text-sm text-muted-foreground">
            Stand: {new Date().toLocaleDateString('de-DE')}
          </p>
        </div>
      </div>
    </div>
  )
}
