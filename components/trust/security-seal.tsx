// components/trust/security-seal.tsx
'use client'

import { Check, Shield } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface SecuritySealProps {
  variant?: 'floating' | 'inline'
  className?: string
}

export function SecuritySeal({ variant = 'inline', className }: SecuritySealProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (variant === 'floating') {
    return (
      <div className={cn('fixed bottom-4 right-4 z-50', className)}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-white shadow-lg transition-all hover:bg-green-700 hover:shadow-xl"
        >
          <Shield className="h-4 w-4" />
          <span className="hidden text-sm font-medium sm:block">SSL-sicher</span>
        </button>

        {isExpanded && (
          <div className="absolute bottom-full right-0 mb-2 w-64 rounded-lg border bg-white p-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-green-100 p-1">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Sicherheitszertifikat</h4>
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  <li>• SSL/TLS Verschlüsselung</li>
                  <li>• DSGVO-konform</li>
                  <li>• Server in Deutschland</li>
                  <li>• Regelmäßige Sicherheits-Audits</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-3 rounded-lg bg-green-50 p-4', className)}>
      <div className="rounded-full bg-green-100 p-2">
        <Shield className="h-5 w-5 text-green-600" />
      </div>
      <div>
        <h4 className="font-medium text-green-900">Sicherheit garantiert</h4>
        <p className="text-sm text-green-700">
          SSL-verschlüsselt • DSGVO-konform • Server in Deutschland
        </p>
      </div>
    </div>
  )
}
