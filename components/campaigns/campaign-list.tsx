// /components/campaigns/campaign-list.tsx
// 🔧 Neu: Delete-Dialog im Karten-Action-Bereich eingebunden

'use client'

import type { CampaignWithStats } from '@/lib/types/campaign'
import { Check, Copy, Edit, ExternalLink, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { DeleteCampaignDialog } from './delete-campaign-dialog'

interface CampaignListProps {
  campaigns: CampaignWithStats[]
}

export function CampaignList({ campaigns }: CampaignListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyLink = (slug: string, id: string) => {
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : (process.env.NEXT_PUBLIC_APP_BASE_URL ?? '')
    const url = `${origin}/r/${slug}`

    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-700',
      paused: 'bg-yellow-100 text-yellow-700',
      archived: 'bg-gray-100 text-gray-700',
    } as const
    const labels = { active: 'Aktiv', paused: 'Pausiert', archived: 'Archiviert' } as const
    return (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${badges[status as keyof typeof badges]}`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  if (campaigns.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-600">Noch keine Kampagnen erstellt</p>
        <p className="mt-2 text-sm text-gray-500">
          Erstellen Sie Ihre erste Kampagne, um Kundenbewertungen zu sammeln
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => {
        const slug = campaign.slug ?? ''
        return (
          <div
            key={campaign.id}
            className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                  {getStatusBadge(campaign.status)}
                </div>

                <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                  <code className="rounded bg-gray-100 px-2 py-1 text-xs">/r/{slug}</code>
                  <button
                    onClick={() => copyLink(slug, campaign.id)}
                    className="rounded p-1 hover:bg-gray-100"
                    title="Link kopieren"
                  >
                    {copiedId === campaign.id ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <a
                    href={`/r/${slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded p-1 hover:bg-gray-100"
                    title="Formular öffnen"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                <div className="mt-3 flex space-x-4 text-sm">
                  <div>
                    <span className="text-gray-600">Testimonials:</span>{' '}
                    <span className="font-medium text-gray-900">
                      {campaign.testimonial_count ?? 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Erstellt:</span>{' '}
                    <span className="font-medium text-gray-900">
                      {new Date(campaign.created_at).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <Link
                  href={`/app/kampagnen/${campaign.id}`}
                  className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                  title="Bearbeiten"
                >
                  <Edit className="h-4 w-4" />
                </Link>

                {/* 🔧 Neu: Lösch-Button via Dialog */}
                <DeleteCampaignDialog
                  campaign={campaign}
                  trigger={
                    <button className="rounded-lg p-2 text-red-600 hover:bg-red-50" title="Löschen">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  }
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
