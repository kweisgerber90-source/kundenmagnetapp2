// components/campaigns/tabs/settings-tab.tsx
// 🎯 Schritt 4C: Settings-Tab für Kampagnen-Einstellungen

'use client'

import { CampaignForm } from '@/components/campaigns/campaign-form'
import { DeleteCampaignDialog } from '@/components/campaigns/delete-campaign-dialog'
import { AlertTriangle, Settings as SettingsIcon, Trash2 } from 'lucide-react'
import type { Campaign } from '@/lib/types'

interface SettingsTabProps {
  campaign: Campaign
}

export function CampaignSettingsTab({ campaign }: SettingsTabProps) {
  return (
    <div className="space-y-6">
      {/* Kampagnen-Einstellungen */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center space-x-3">
          <SettingsIcon className="h-6 w-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Kampagnen-Einstellungen
          </h3>
        </div>

        <p className="mt-2 text-sm text-gray-600">
          Passe den Namen, Slug und Status deiner Kampagne an.
        </p>

        <div className="mt-6">
          <CampaignForm campaign={campaign} />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900">Gefahrenzone</h3>
        </div>

        <p className="mt-2 text-sm text-red-700">
          Das Löschen einer Kampagne kann nicht rückgängig gemacht werden. Alle
          zugehörigen Testimonials, QR-Codes und Widget-Einstellungen werden
          ebenfalls gelöscht.
        </p>

        <div className="mt-4">
          <DeleteCampaignDialog
            campaign={campaign}
            redirectTo="/app/kampagnen"
            trigger={
              <button className="inline-flex items-center space-x-2 rounded-lg border border-red-300 bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200">
                <Trash2 className="h-4 w-4" />
                <span>Kampagne löschen</span>
              </button>
            }
          />
        </div>
      </div>

      {/* Info Box */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
        <h4 className="font-semibold text-blue-900">Wichtige Hinweise</h4>
        <ul className="mt-2 space-y-1 text-sm text-blue-700">
          <li>
            • Der <strong>Slug</strong> bestimmt die URL deines
            Testimonial-Formulars
          </li>
          <li>
            • Der <strong>Status</strong> steuert, ob neue Testimonials
            eingereicht werden können
          </li>
          <li>
            • Pausierte Kampagnen sind weiterhin sichtbar, nehmen aber keine
            neuen Testimonials an
          </li>
          <li>
            • Archivierte Kampagnen sind komplett deaktiviert und nicht mehr
            zugänglich
          </li>
        </ul>
      </div>
    </div>
  )
}
