// /components/campaigns/campaign-dialog.tsx
// Dialog zum Erstellen einer Kampagne
// 🔧 Korrektur: "onSuccess/onCancel" → "onSaved"; Props an CampaignForm angepasst

'use client'

import type { Campaign } from '@/lib/types/campaign'
import { useState } from 'react'
import { CampaignForm } from './campaign-form'

export function CampaignDialog() {
  const [open, setOpen] = useState<boolean>(false)

  function handleSaved(_c: Campaign) {
    // 🔧 Korrektur: Einheitliche Callback-Signatur
    setOpen(false)
  }

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Neue Kampagne
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Neue Kampagne erstellen</h3>
              <button
                onClick={() => setOpen(false)}
                className="rounded p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Schließen"
              >
                ✕
              </button>
            </div>

            <div className="mt-6">
              {/* 🔧 CampaignForm erwartet { onSaved } */}
              <CampaignForm onSaved={handleSaved} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
