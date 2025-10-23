// /components/campaigns/delete-campaign-dialog.tsx
// 🔧 Fix: redirectTo als Route typisieren

'use client'

import type { Campaign } from '@/lib/types/campaign'
import type { Route } from 'next' // ✅
import { useRouter } from 'next/navigation'
import { useState, type ReactNode } from 'react'

interface DeleteCampaignDialogProps {
  campaign: Campaign
  /** Optional: wohin nach erfolgreichem Löschen navigieren */
  redirectTo?: Route
  /** Optional: eigener Trigger-Button/Link */
  trigger?: ReactNode
}

export function DeleteCampaignDialog({ campaign, redirectTo, trigger }: DeleteCampaignDialogProps) {
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/campaigns/${encodeURIComponent(campaign.id)}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(payload.error ?? 'Löschen fehlgeschlagen')
      }
      setOpen(false)
      if (redirectTo) {
        // ✅ typedRoutes:  Route
        router.push(redirectTo)
      } else {
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler')
    } finally {
      setLoading(false)
    }
  }

  const Trigger = () =>
    trigger ? (
      <span onClick={() => setOpen(true)}>{trigger}</span>
    ) : (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
        title="Löschen"
      >
        Löschen
      </button>
    )

  return (
    <div>
      <Trigger />

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold">Kampagne löschen?</h3>
            <p className="mt-2 text-sm text-gray-600">
              Diese Aktion kann nicht rückgängig gemacht werden.
            </p>

            {error && (
              <div className="mt-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-2">
              <button
                className="rounded-lg border px-3 py-2 hover:bg-gray-50"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Abbrechen
              </button>
              <button
                className="rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700 disabled:opacity-60"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? 'Löschen…' : 'Löschen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
