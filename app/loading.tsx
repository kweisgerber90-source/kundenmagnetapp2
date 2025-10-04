export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-8 w-8 animate-spin text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-800">Wird geladen...</h2>
          <p className="text-gray-600">
            Bitte warten Sie einen Moment, während wir Ihre Inhalte laden.
          </p>
        </div>

        <div className="mb-4 h-2 w-full rounded-full bg-gray-200">
          <div className="h-2 w-1/3 animate-pulse rounded-full bg-blue-600"></div>
        </div>

        <div className="space-y-2">
          <div className="h-4 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  )
}
