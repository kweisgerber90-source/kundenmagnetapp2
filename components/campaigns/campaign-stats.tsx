// components/campaigns/campaign-stats.tsx
// 🎯 Schritt 4C: Statistik-Karten für Kampagnen-Detailseite

'use client'

import { MessageSquare, QrCode, Star, TrendingUp } from 'lucide-react'
import type { CampaignWithStats } from '@/lib/types'

interface CampaignStatsProps {
  campaign: CampaignWithStats
}

export function CampaignStats({ campaign }: CampaignStatsProps) {
  const { testimonials, qrCodes } = campaign

  const stats = [
    {
      label: 'Gesamt Testimonials',
      value: testimonials?.total || 0,
      icon: MessageSquare,
      color: 'blue',
      description: `${testimonials?.approved || 0} genehmigt, ${testimonials?.pending || 0} wartend`,
    },
    {
      label: 'Durchschnittsbewertung',
      value: testimonials?.averageRating
        ? testimonials.averageRating.toFixed(1)
        : '0.0',
      icon: Star,
      color: 'yellow',
      description: `Aus ${testimonials?.total || 0} Bewertungen`,
      suffix: '★',
    },
    {
      label: 'QR-Codes',
      value: qrCodes?.total || 0,
      icon: QrCode,
      color: 'purple',
      description: `${qrCodes?.totalScans || 0} Scans gesamt`,
    },
    {
      label: 'Conversion',
      value:
        testimonials?.total && qrCodes?.totalScans && qrCodes.totalScans > 0
          ? `${Math.round((testimonials.total / qrCodes.totalScans) * 100)}%`
          : '0%',
      icon: TrendingUp,
      color: 'green',
      description: 'Testimonials pro Scan',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        const colorClasses = {
          blue: 'bg-blue-50 text-blue-600',
          yellow: 'bg-yellow-50 text-yellow-600',
          purple: 'bg-purple-50 text-purple-600',
          green: 'bg-green-50 text-green-600',
        }[stat.color]

        return (
          <div
            key={stat.label}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stat.value}
                  {stat.suffix && (
                    <span className="ml-1 text-2xl text-yellow-500">
                      {stat.suffix}
                    </span>
                  )}
                </p>
                <p className="mt-1 text-xs text-gray-500">{stat.description}</p>
              </div>
              <div className={`rounded-lg p-3 ${colorClasses}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
