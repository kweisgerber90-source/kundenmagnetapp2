// components/qr/qr-stats.tsx
// 📊 QR-Code-Statistiken-Anzeige
// 🔐 DSGVO: Nur aggregierte Daten, keine personenbezogenen Infos

'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { QRStats } from '@/lib/qr/types'
import { BarChart3, TrendingUp } from 'lucide-react'

interface QRStatsDisplayProps {
  stats: QRStats
}

export function QRStatsDisplay({ stats }: QRStatsDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Übersicht */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Scans gesamt</CardDescription>
            <CardTitle className="text-3xl">{stats.total_scans}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Letzte 7 Tage</CardDescription>
            <CardTitle className="text-3xl">{stats.scans_last_7_days}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Letzte 30 Tage</CardDescription>
            <CardTitle className="text-3xl">{stats.scans_last_30_days}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Scans nach Tag */}
      {stats.scans_by_day.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-gray-500" />
              <CardTitle>Scans pro Tag (letzte 30 Tage)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.scans_by_day.slice(-14).map((day) => (
                <div key={day.date} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-gray-600">
                    {new Date(day.date).toLocaleDateString('de-DE', {
                      day: '2-digit',
                      month: '2-digit',
                    })}
                  </div>
                  <div className="flex-1">
                    <div className="h-8 rounded bg-gray-100">
                      <div
                        className="h-full rounded bg-indigo-600 transition-all"
                        style={{
                          width: `${Math.max(
                            (day.count / Math.max(...stats.scans_by_day.map((d) => d.count))) * 100,
                            5,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-right text-sm font-semibold text-gray-900">
                    {day.count}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Referrer */}
      {stats.top_referrers.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gray-500" />
              <CardTitle>Top Referrer</CardTitle>
            </div>
            <CardDescription>Woher kamen die Scans?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.top_referrers.slice(0, 5).map((ref, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1 truncate text-sm text-gray-700">{ref.referer}</div>
                  <div className="ml-4 text-sm font-semibold text-gray-900">{ref.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {stats.total_scans === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">Noch keine Scans vorhanden</p>
            <p className="mt-2 text-sm text-gray-500">
              Teilen Sie den QR-Code, um Statistiken zu sehen
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
