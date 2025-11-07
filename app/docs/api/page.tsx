// app/docs/api/page.tsx
// -----------------------------------------------------------------------------
// 📚 API-Dokumentation (Stub)
// - Zweck: Verhindert Build-Fehler durch typedRoutes-Link auf "/docs/api"
// - Inhalt: Platzhaltertext; später durch echte API-Doku ersetzen
// -----------------------------------------------------------------------------

import Link from 'next/link'

export const metadata = {
  title: 'API-Dokumentation | Kundenmagnetapp',
  description:
    'Übersicht der öffentlichen und authentifizierten Endpunkte der Kundenmagnetapp API.',
}

export default function ApiDocsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <nav className="mb-6 text-sm">
        {/* 🔗 Breadcrumbs */}
        <Link href="/docs" className="underline hover:no-underline">
          Docs
        </Link>{' '}
        / <span className="text-gray-500">API</span>
      </nav>

      <h1 className="mb-4 text-3xl font-semibold">API-Dokumentation</h1>

      <p className="mb-4 text-gray-700">
        Diese Seite ist eine vorläufige Platzhalter-Dokumentation. Die vollständige API-Referenz
        folgt in einem der nächsten Schritte (3M/4B).
      </p>

      <ul className="list-disc space-y-2 pl-5 text-gray-800">
        <li>
          Öffentliche Widget-API: <code>/api/widget?campaign=slug</code> (nur freigegebene
          Testimonials)
        </li>
        <li>Geplante Bereiche: Authentifizierte Endpunkte für Admin-Funktionen</li>
      </ul>

      <p className="mt-8">
        Zurück zur{' '}
        <Link href="/docs" className="text-blue-600 underline hover:no-underline">
          allgemeinen Dokumentation
        </Link>
        .
      </p>
    </main>
  )
}
