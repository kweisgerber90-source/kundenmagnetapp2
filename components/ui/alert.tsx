// components/ui/alert.tsx
// Für Fehlermeldungen/Status-Hinweise in Formularen.

import { cn } from '@/lib/utils'
import * as React from 'react'

export function AlertError({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700',
      )}
    >
      {children}
    </div>
  )
}

export function AlertSuccess({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700',
      )}
    >
      {children}
    </div>
  )
}
