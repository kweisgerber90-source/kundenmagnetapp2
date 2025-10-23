// components/reviews/review-thank-you.tsx
// Danke-Seite nach erfolgreichem Submit

import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

export function ReviewThankYou() {
  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-8 text-center shadow-lg">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>

      <h2 className="mt-6 text-2xl font-bold text-gray-900">Vielen Dank für Ihre Bewertung!</h2>

      <p className="mt-4 text-gray-600">
        Ihre Bewertung wurde erfolgreich übermittelt und wird geprüft, bevor sie veröffentlicht
        wird.
      </p>

      <div className="mt-8 rounded-lg bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          💡 Ihre Bewertung erscheint nach Freigabe durch den Administrator auf der Website und
          hilft anderen Kunden bei ihrer Entscheidung.
        </p>
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
        >
          Zur Startseite
        </Link>
      </div>
    </div>
  )
}
