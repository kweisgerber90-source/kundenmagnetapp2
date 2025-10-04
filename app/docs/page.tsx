// app/docs/page.tsx
export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">Dokumentation</h1>

        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-semibold">Schnellstart</h2>
          <p className="text-muted-foreground">
            Mit Kundenmagnetapp sammeln Sie in wenigen Minuten Ihre ersten Kundenbewertungen.
          </p>

          <h3 className="mt-6 text-xl font-semibold">1. Kampagne erstellen</h3>
          <p>
            Erstellen Sie Ihre erste Kampagne und passen Sie das Formular an Ihre Bedürfnisse an.
          </p>

          <h3 className="mt-6 text-xl font-semibold">2. Testimonials sammeln</h3>
          <p>Teilen Sie den Link oder QR-Code mit Ihren Kunden.</p>

          <h3 className="mt-6 text-xl font-semibold">3. Widget einbinden</h3>
          <p>Fügen Sie das Widget mit einer Zeile Code auf Ihrer Website ein.</p>
        </div>
      </div>
    </div>
  )
}
