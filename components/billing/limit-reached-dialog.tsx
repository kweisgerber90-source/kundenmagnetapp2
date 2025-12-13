// /components/billing/limit-reached-dialog.tsx
'use client'

/**
 * 🚫 Limit Reached Dialog (minimal)
 * 🔧 Korrektur: Kein Import von '@/components/ui/alert-dialog' (Datei existiert nicht im Repo).
 * 🔧 Korrektur: Keine function-props nach außen, um Next/TS Warnung zu vermeiden.
 */

import * as React from 'react'

type LimitType = 'campaigns' | 'testimonials' | 'qr_codes' | 'widget_requests' | 'qr_scans'

const LIMIT_MESSAGES: Record<LimitType, { title: string; description: string }> = {
  campaigns: {
    title: 'Kampagnen-Limit erreicht',
    description: 'Sie haben das maximale Limit für Kampagnen in Ihrem Plan erreicht.',
  },
  testimonials: {
    title: 'Testimonial-Limit erreicht',
    description: 'Diese Kampagne hat das maximale Limit für Testimonials erreicht.',
  },
  qr_codes: {
    title: 'QR-Code-Limit erreicht',
    description: 'Sie haben das maximale Limit für QR-Codes in Ihrem Plan erreicht.',
  },
  widget_requests: {
    title: 'Widget-Anfragen-Limit erreicht',
    description:
      'Sie haben das Tages-Limit für Widget-Anfragen erreicht. Versuchen Sie es morgen erneut oder upgraden Sie Ihren Plan.',
  },
  qr_scans: {
    title: 'QR-Scan-Limit erreicht',
    description:
      'Sie haben das Tages-Limit für QR-Scans erreicht. Versuchen Sie es morgen erneut oder upgraden Sie Ihren Plan.',
  },
}

type LimitDialogState =
  | {
      open: true
      limitType: LimitType
      current: number
      limit: number
      currentPlan: string
    }
  | { open: false }

const LimitDialogContext = React.createContext<{
  state: LimitDialogState
  show: (args: {
    limitType: LimitType
    current: number
    limit: number
    currentPlan: string
  }) => void
  close: () => void
} | null>(null)

export function LimitDialogProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<LimitDialogState>({ open: false })

  const show = React.useCallback(
    (args: { limitType: LimitType; current: number; limit: number; currentPlan: string }) => {
      setState({ open: true, ...args })
    },
    [],
  )

  const close = React.useCallback(() => setState({ open: false }), [])

  return (
    <LimitDialogContext.Provider value={{ state, show, close }}>
      {children}
      <LimitReachedDialog />
    </LimitDialogContext.Provider>
  )
}

export function useLimitDialog() {
  const ctx = React.useContext(LimitDialogContext)
  if (!ctx) {
    throw new Error('useLimitDialog muss innerhalb von <LimitDialogProvider> verwendet werden.')
  }
  return ctx
}

function LimitReachedDialog() {
  const ctx = React.useContext(LimitDialogContext)
  if (!ctx) return null

  const { state, close } = ctx
  if (!state.open) return null

  const msg = LIMIT_MESSAGES[state.limitType]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h3 className="text-lg font-semibold">{msg.title}</h3>
        <p className="mt-2 text-sm text-slate-600">{msg.description}</p>

        <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm">
          <div className="font-medium">
            Aktuell: {state.current} / {state.limit}
          </div>
          <div className="text-slate-500">Plan: {state.currentPlan}</div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={close}
            className="inline-flex h-9 items-center justify-center rounded-md border border-slate-300 px-3 text-sm"
          >
            Schließen
          </button>

          {/* 🔧 Korrektur: Upgrade-Ziel ist /pricing (nicht /app/billing) */}
          <a
            href="/pricing"
            className="inline-flex h-9 items-center justify-center rounded-md bg-slate-900 px-3 text-sm text-white"
          >
            Jetzt upgraden
          </a>
        </div>
      </div>
    </div>
  )
}
