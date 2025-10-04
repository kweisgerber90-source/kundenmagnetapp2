// components/trust/privacy-hint.tsx
'use client'

import { Shield, X } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface PrivacyHintProps {
  variant?: 'inline' | 'banner'
  dismissible?: boolean
  className?: string
}

export function PrivacyHint({
  variant = 'inline',
  dismissible = false,
  className,
}: PrivacyHintProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed) return null

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2 text-xs text-gray-500', className)}>
        <Shield className="h-3 w-3 text-blue-500" />
        <span>Ihre Daten sind bei uns sicher - DSGVO-konform und SSL-verschlüsselt</span>
      </div>
    )
  }

  return (
    <div className={cn('relative rounded-lg border border-blue-100 bg-blue-50 p-4', className)}>
      {dismissible && (
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute right-2 top-2 rounded-full p-1 hover:bg-blue-100"
          aria-label="Schließen"
        >
          <X className="h-4 w-4 text-blue-600" />
        </button>
      )}

      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-full bg-blue-100 p-1">
          <Shield className="h-4 w-4 text-blue-600" />
        </div>
        <div>
          <h4 className="font-medium text-blue-900">Datenschutz ist unser Versprechen</h4>
          <p className="mt-1 text-sm text-blue-700">
            Alle Daten werden DSGVO-konform verarbeitet und auf Servern in Deutschland gespeichert.
            SSL-Verschlüsselung schützt jede Übertragung.
          </p>
        </div>
      </div>
    </div>
  )
}
