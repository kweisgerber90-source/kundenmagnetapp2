// /components/billing/usage-indicator.tsx
'use client'

/**
 * 📊 Usage Indicator Component
 * Zeigt aktuelle Nutzung vs. Plan-Limits an
 */

import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { UsageStats } from '@/lib/types/billing'
import { useEffect, useState } from 'react'

export function UsageIndicator() {
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsage() {
      try {
        const res = await fetch('/api/billing/usage')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setStats(data)
      } catch (error) {
        console.error('Usage fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsage()
  }, [])

  if (loading) {
    return <div className="text-sm text-muted-foreground">Lade Nutzung...</div>
  }

  if (!stats) {
    return <div className="text-sm text-muted-foreground">Nutzung nicht verfügbar</div>
  }

  const usageItems = [
    { label: 'Kampagnen', current: stats.campaigns.current, limit: stats.campaigns.limit },
    { label: 'QR Codes', current: stats.qrCodes.current, limit: stats.qrCodes.limit },
    {
      label: 'Widget Requests (heute)',
      current: stats.widgetRequests.today,
      limit: stats.widgetRequests.limit,
    },
    { label: 'QR Scans (heute)', current: stats.qrScans.today, limit: stats.qrScans.limit },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Nutzung &amp; Limits</h3>

      {usageItems.map((item) => {
        const isUnlimited = item.limit === -1
        const percentage = isUnlimited ? 0 : Math.min((item.current / item.limit) * 100, 100)
        const isNearLimit = !isUnlimited && percentage >= 80
        const isExceeded = !isUnlimited && item.current >= item.limit

        // 🔧 Korrektur: Badge unterstützt nur default/secondary/outline (kein destructive)
        const badgeVariant = isExceeded ? 'default' : isNearLimit ? 'outline' : 'secondary'

        return (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{item.label}</span>

              <div className="flex items-center gap-2">
                {isUnlimited ? (
                  <Badge variant="secondary">Unbegrenzt</Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {item.current} / {item.limit}
                  </span>
                )}

                {(isNearLimit || isExceeded) && (
                  <Badge variant={badgeVariant}>
                    {isExceeded ? 'Limit erreicht' : 'Fast voll'}
                  </Badge>
                )}
              </div>
            </div>

            {!isUnlimited && <Progress value={percentage} className="h-2" />}
          </div>
        )
      })}
    </div>
  )
}
