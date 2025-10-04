// app/legal/datenschutz/page.tsx
import { BRAND } from '@/lib/constants'

export default function DatenschutzPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Datenschutzerklärung</h1>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-xl font-semibold">1. Datenschutz auf einen Blick</h2>

          <h3 className="mt-4 text-lg font-semibold">Allgemeine Hinweise</h3>
          <p>
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
            personenbezogenen Daten passiert, wenn Sie unsere Website besuchen. Personenbezogene
            Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
          </p>

          <h3 className="mt-4 text-lg font-semibold">Datenerfassung auf unserer Website</h3>
          <p>
            <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong>
            <br />
            Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen
            Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
          </p>

          <p className="mt-2">
            <strong>Wie erfassen wir Ihre Daten?</strong>
            <br />
            Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann
            es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
          </p>

          <p className="mt-2">
            <strong>Wofür nutzen wir Ihre Daten?</strong>
            <br />
            Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu
            gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
          </p>

          <h2 className="mt-6 text-xl font-semibold">2. Hosting</h2>
          <p>Wir hosten die Inhalte unserer Website bei folgendem Anbieter:</p>

          <h3 className="mt-4 text-lg font-semibold">Externes Hosting</h3>
          <p>
            Diese Website wird extern gehostet. Die personenbezogenen Daten, die auf dieser Website
            erfasst werden, werden auf den Servern des Hosters / der Hoster gespeichert. Hierbei
            kann es sich v. a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten,
            Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, die über eine
            Website generiert werden, handeln.
          </p>

          <p className="mt-2">
            Das externe Hosting erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren
            potenziellen und bestehenden Kunden (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse einer
            sicheren, schnellen und effizienten Bereitstellung unseres Online-Angebots durch einen
            professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO).
          </p>

          <h2 className="mt-6 text-xl font-semibold">
            3. Allgemeine Hinweise und Pflichtinformationen
          </h2>

          <h3 className="mt-4 text-lg font-semibold">Datenschutz</h3>
          <p>
            Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir
            behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen
            Datenschutzvorschriften sowie dieser Datenschutzerklärung.
          </p>

          <h3 className="mt-4 text-lg font-semibold">Hinweis zur verantwortlichen Stelle</h3>
          <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
          <p className="mt-2">
            {BRAND.owner}
            <br />
            {BRAND.address.street}
            <br />
            {BRAND.address.zip} {BRAND.address.city}
            <br />
            Telefon: {BRAND.phone}
            <br />
            E-Mail: {BRAND.email.support}
          </p>

          <h3 className="mt-4 text-lg font-semibold">Speicherdauer</h3>
          <p>
            Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt
            wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die
            Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder
            eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern
            wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer
            personenbezogenen Daten haben.
          </p>

          <h3 className="mt-4 text-lg font-semibold">Ihre Rechte</h3>
          <p>Sie haben folgende Rechte:</p>
          <ul className="mt-2 list-disc pl-6">
            <li>Auskunft über Ihre bei uns gespeicherten Daten (Art. 15 DSGVO)</li>
            <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
            <li>Löschung Ihrer bei uns gespeicherten Daten (Art. 17 DSGVO)</li>
            <li>Einschränkung der Datenverarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch gegen die Verarbeitung Ihrer Daten (Art. 21 DSGVO)</li>
            <li>Widerruf erteilter Einwilligungen (Art. 7 Abs. 3 DSGVO)</li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">4. Datenerfassung auf unserer Website</h2>

          <h3 className="mt-4 text-lg font-semibold">Cookies</h3>
          <p>
            Unsere Internetseiten verwenden so genannte &quot;Cookies&quot;. Cookies sind kleine
            Textdateien und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder
            vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente
            Cookies) auf Ihrem Endgerät gespeichert.
          </p>

          <p className="mt-2">
            Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert
            werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte
            Fälle oder generell ausschließen sowie das automatische Löschen der Cookies beim
            Schließen des Browsers aktivieren.
          </p>

          <h3 className="mt-4 text-lg font-semibold">Server-Log-Dateien</h3>
          <p>
            Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten
            Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
          </p>
          <ul className="mt-2 list-disc pl-6">
            <li>Browsertyp und Browserversion</li>
            <li>verwendetes Betriebssystem</li>
            <li>Referrer URL</li>
            <li>Hostname des zugreifenden Rechners</li>
            <li>Uhrzeit der Serveranfrage</li>
            <li>IP-Adresse (anonymisiert)</li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">5. Zahlungsanbieter</h2>

          <h3 className="mt-4 text-lg font-semibold">Stripe</h3>
          <p>
            Wir nutzen den Zahlungsdienstleister Stripe (Stripe, Inc., 510 Townsend Street, San
            Francisco, CA 94103, USA). Bei Zahlungen über Stripe werden Ihre Zahlungsdaten an Stripe
            übertragen. Die Übertragung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO
            (Vertragsabwicklung).
          </p>
          <p className="mt-2">
            Weitere Informationen finden Sie in der Datenschutzerklärung von Stripe unter:
            https://stripe.com/de/privacy
          </p>

          <h2 className="mt-6 text-xl font-semibold">6. E-Mail-Versand</h2>

          <h3 className="mt-4 text-lg font-semibold">Amazon Web Services (AWS SES)</h3>
          <p>
            Für den Versand von E-Mails nutzen wir Amazon Web Services Simple Email Service (AWS
            SES). Die Server befinden sich ausschließlich in der EU-Region (Frankfurt,
            eu-central-1). AWS ist nach ISO 27001, ISO 27017, ISO 27018 zertifiziert und
            DSGVO-konform.
          </p>
          <p className="mt-2">
            Die Verarbeitung erfolgt auf Grundlage unserer berechtigten Interessen (Art. 6 Abs. 1
            lit. f DSGVO) an einem technisch einwandfreien E-Mail-Versand.
          </p>

          <p className="mt-4 text-sm text-muted-foreground">
            Stand: {new Date().toLocaleDateString('de-DE')}
          </p>
        </div>
      </div>
    </div>
  )
}
