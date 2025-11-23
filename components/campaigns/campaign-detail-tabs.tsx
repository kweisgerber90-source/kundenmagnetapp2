// components/campaigns/campaign-detail-tabs.tsx
// 🎯 Schritt 4C: Tab-Navigation für Kampagnen-Detailseite

'use client'

import type { Campaign, QRCode, Testimonial } from '@/lib/types'
import { BarChart3, Code, MessageSquare, QrCode, Settings } from 'lucide-react'
import Link from 'next/link'
import type { Route } from 'next'
import { usePathname } from 'next/navigation'
import { CampaignOverviewTab } from './tabs/overview-tab'
import { CampaignQRTab } from './tabs/qr-tab'
import { CampaignSettingsTab } from './tabs/settings-tab'
import { CampaignTestimonialsTab } from './tabs/testimonials-tab'
import { CampaignWidgetTab } from './tabs/widget-tab'

interface CampaignDetailTabsProps {
  campaign: Campaign
  testimonials: Testimonial[]
  qrCodes: QRCode[]
  activeTab: string
  formUrl: string
  widgetUrl: string
}

const tabs = [
  {
    id: 'overview',
    label: 'Übersicht',
    icon: BarChart3,
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    icon: MessageSquare,
  },
  {
    id: 'widget',
    label: 'Widget',
    icon: Code,
  },
  {
    id: 'qr',
    label: 'QR-Codes',
    icon: QrCode,
  },
  {
    id: 'settings',
    label: 'Einstellungen',
    icon: Settings,
  },
]

export function CampaignDetailTabs({
  campaign,
  testimonials,
  qrCodes,
  activeTab,
  formUrl,
  widgetUrl,
}: CampaignDetailTabsProps) {
  const pathname = usePathname()

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <CampaignOverviewTab
            campaign={campaign}
            testimonials={testimonials}
            qrCodes={qrCodes}
            formUrl={formUrl}
          />
        )
      case 'testimonials':
        return <CampaignTestimonialsTab campaign={campaign} testimonials={testimonials} />
      case 'widget':
        return <CampaignWidgetTab campaign={campaign} widgetUrl={widgetUrl} />
      case 'qr':
        return <CampaignQRTab campaign={campaign} qrCodes={qrCodes} />
      case 'settings':
        return <CampaignSettingsTab campaign={campaign} />
      default:
        return (
          <CampaignOverviewTab
            campaign={campaign}
            testimonials={testimonials}
            qrCodes={qrCodes}
            formUrl={formUrl}
          />
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <Link
                key={tab.id}
                href={`${pathname}?tab=${tab.id}` as Route}
                className={`group inline-flex items-center space-x-2 border-b-2 px-1 py-4 text-sm font-medium ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                <span>{tab.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>{renderTabContent()}</div>
    </div>
  )
}
