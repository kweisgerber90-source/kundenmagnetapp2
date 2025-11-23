// app/app/kampagnen/[id]/page.tsx
// 🎯 Schritt 4C: Kampagnen-Detailseite mit Tabs, Stats und Testimonial-Management

import { CampaignDetailTabs } from '@/components/campaigns/campaign-detail-tabs'
import { CampaignStats } from '@/components/campaigns/campaign-stats'
import { DeleteCampaignDialog } from '@/components/campaigns/delete-campaign-dialog'
import { getUser } from '@/lib/supabase/server'
import type { Campaign, CampaignWithStats, QRCode, Testimonial } from '@/lib/types'
import { ArrowLeft, ExternalLink, Trash2 } from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'
import type { Route } from 'next'
import { notFound, redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CampaignDetailPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams?: { tab?: string }
}) {
  const user = await getUser()
  if (!user) redirect('/login')

  const { id } = params
  const activeTab = searchParams?.tab || 'overview'

  const hdrs = headers()
  const proto = hdrs.get('x-forwarded-proto') ?? 'http'
  const host = hdrs.get('host') ?? 'localhost:3000'
  const origin = `${proto}://${host}`

  // Kampagne laden
  const campaignRes = await fetch(`${origin}/api/campaigns/${id}`, {
    headers: { cookie: hdrs.get('cookie') ?? '' },
    cache: 'no-store',
  })

  if (campaignRes.status === 404) notFound()
  if (!campaignRes.ok) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
        Kampagne konnte nicht geladen werden.
      </div>
    )
  }

  const { campaign } = (await campaignRes.json()) as { campaign: Campaign }

  // Testimonials für diese Kampagne laden
  const testimonialsRes = await fetch(`${origin}/api/testimonials?campaignId=${id}`, {
    headers: { cookie: hdrs.get('cookie') ?? '' },
    cache: 'no-store',
  })

  const { testimonials = [] }: { testimonials: Testimonial[] } = testimonialsRes.ok
    ? await testimonialsRes.json()
    : { testimonials: [] }

  // Stats berechnen
  const stats = {
    total: testimonials.length,
    pending: testimonials.filter((t) => t.status === 'pending').length,
    approved: testimonials.filter((t) => t.status === 'approved').length,
    hidden: testimonials.filter((t) => t.status === 'hidden').length,
    averageRating:
      testimonials.length > 0
        ? testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / testimonials.length
        : 0,
  }

  // QR-Codes laden (falls vorhanden)
  const qrRes = await fetch(`${origin}/api/qr?campaignId=${id}`, {
    headers: { cookie: hdrs.get('cookie') ?? '' },
    cache: 'no-store',
  })

  const { qrCodes = [] }: { qrCodes: QRCode[] } = qrRes.ok ? await qrRes.json() : { qrCodes: [] }

  const qrStats = {
    total: qrCodes.length,
    totalScans: qrCodes.reduce((sum, qr) => sum + (qr.scan_count || 0), 0),
    averageScansPerCode:
      qrCodes.length > 0
        ? qrCodes.reduce((sum, qr) => sum + (qr.scan_count || 0), 0) / qrCodes.length
        : 0,
  }

  const campaignWithStats: CampaignWithStats = {
    ...campaign,
    testimonials: stats,
    qrCodes: qrStats,
  }

  // Formular-URL für Testimonial-Einreichung
  const formUrl = `${origin}/r/${campaign.slug}`
  const widgetUrl = `${origin}/widget/${campaign.slug}.js`

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Link
            href="/app/kampagnen"
            className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Zurück zu Kampagnen</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="inline-flex items-center">
              Status:{' '}
              <span
                className={`ml-2 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                  campaign.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : campaign.status === 'paused'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                }`}
              >
                {campaign.status === 'active'
                  ? 'Aktiv'
                  : campaign.status === 'paused'
                    ? 'Pausiert'
                    : 'Archiviert'}
              </span>
            </span>
            <span>•</span>
            <Link
              href={formUrl as Route}
              target="_blank"
              className="inline-flex items-center space-x-1 hover:text-blue-600"
            >
              <span>/{campaign.slug}</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <DeleteCampaignDialog
          campaign={campaign}
          redirectTo="/app/kampagnen"
          trigger={
            <button className="inline-flex items-center space-x-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100">
              <Trash2 className="h-4 w-4" />
              <span>Löschen</span>
            </button>
          }
        />
      </div>

      {/* Statistiken */}
      <CampaignStats campaign={campaignWithStats} />

      {/* Tabs für verschiedene Bereiche */}
      <CampaignDetailTabs
        campaign={campaign}
        testimonials={testimonials}
        qrCodes={qrCodes}
        activeTab={activeTab}
        formUrl={formUrl}
        widgetUrl={widgetUrl}
      />
    </div>
  )
}
