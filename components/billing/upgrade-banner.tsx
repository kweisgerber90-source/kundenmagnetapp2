'use client'

/**
 * 🚀 Upgrade Banner
 * Zeigt Banner wenn User nahe am Limit ist
 */

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import type { UsageStats } from '@/lib/types/billing'
import { RocketIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function UpgradeBanner() {
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    async function checkUsage() {
      try {
        const res = await fetch('/api/billing/usage')
        if (!res.ok) return
        const data = await res.json()
        setStats(data)

        // Check if any usage is above 80%
        const checks = [
          data.campaigns.limit !== -1 && data.campaigns.current / data.campaigns.limit >= 0.8,
          data.qrCodes.limit !== -1 && data.qrCodes.current / data.qrCodes.limit >= 0.8,
          data.widgetRequests.limit !== -1 &&
            data.widgetRequests.today / data.widgetRequests.limit >= 0.8,
          data.qrScans.limit !== -1 && data.qrScans.today / data.qrScans.limit >= 0.8,
        ]

        setShowBanner(checks.some(Boolean))
      } catch (error) {
        console.error('Usage check error:', error)
      }
    }

    checkUsage()
  }, [])

  if (!showBanner || !stats) return null

  return (
    <Alert className="border-orange-200 bg-orange-50">
      <RocketIcon className="h-4 w-4" />
      <AlertTitle>Du näherst dich deinen Limits!</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">
          Upgrade jetzt für mehr Kampagnen, QR Codes und höhere tägliche Limits.
        </p>
        <Button
          onClick={() => (window.location.href = '/pricing')}
          className="bg-orange-600 hover:bg-orange-700"
        >
          Jetzt upgraden
        </Button>
      </AlertDescription>
    </Alert>
  )
}
