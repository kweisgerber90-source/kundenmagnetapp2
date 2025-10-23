import { useMemo } from 'react'

export interface StarRatingProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

export function StarRating({ value, onChange, disabled }: StarRatingProps) {
  const stars = useMemo(() => [1, 2, 3, 4, 5], [])

  return (
    <div className="inline-flex items-center space-x-1">
      {stars.map((n) => {
        const active = value >= n
        return (
          <button
            key={n}
            type="button"
            disabled={!!disabled}
            onClick={() => onChange(n)}
            className={`h-8 w-8 rounded transition ${
              active ? 'bg-yellow-400' : 'bg-gray-200'
            } hover:opacity-80 disabled:cursor-not-allowed`}
            aria-label={`${n} Sterne`}
            title={`${n} Sterne`}
          >
            <span className="block text-center text-sm font-bold">{active ? '★' : '☆'}</span>
          </button>
        )
      })}
      {value > 0 && !disabled && (
        <button
          type="button"
          onClick={() => onChange(0)}
          className="ml-2 rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200"
          aria-label="Bewertung zurücksetzen"
          title="Bewertung zurücksetzen"
        >
          Zurücksetzen
        </button>
      )}
    </div>
  )
}
