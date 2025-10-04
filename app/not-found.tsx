import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-12 w-12 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0012 15c-2.34 0-4.464-.881-6.08-2.33C5.934 12.66 6 12.345 6 12c0-.345-.066-.66-.08-.67A7.962 7.962 0 0012 9c2.34 0 4.464.881 6.08 2.33M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
          <h2 className="mb-2 text-2xl font-semibold text-gray-800">Seite nicht gefunden</h2>
          <p className="mb-6 text-gray-600">
            Die gesuchte Seite existiert nicht oder wurde verschoben. Überprüfen Sie die URL oder
            kehren Sie zur Startseite zurück.
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/">Zur Startseite</Link>
          </Button>

          <Button variant="outline" asChild className="w-full">
            <Link href="/contact">Kontakt aufnehmen</Link>
          </Button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Fehlercode: 404 - Not Found</p>
        </div>
      </div>
    </div>
  )
}
