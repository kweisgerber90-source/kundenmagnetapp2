'use client'

import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-12 w-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Etwas ist schief gelaufen</h1>
          <p className="mb-6 text-gray-600">
            Es tut uns leid, aber es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es
            erneut.
          </p>
        </div>

        <div className="space-y-4">
          <Button onClick={reset} className="w-full">
            Erneut versuchen
          </Button>

          <Button variant="outline" className="w-full" onClick={() => (window.location.href = '/')}>
            Zur Startseite
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && error.digest && (
          <div className="mt-6 rounded-lg bg-gray-100 p-4 text-left">
            <p className="font-mono text-sm text-gray-600">Error ID: {error.digest}</p>
          </div>
        )}
      </div>
    </div>
  )
}
