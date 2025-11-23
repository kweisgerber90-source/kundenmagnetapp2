// components/campaigns/tabs/overview-tab.tsx
// 🎯 Schritt 4C: Übersicht-Tab mit Quick Actions und neuesten Aktivitäten

'use client'

import { Button } from '@/components/ui/button'
import type { Campaign, QRCode, Testimonial } from '@/lib/types'
import {
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  MessageSquare,
  Plus,
  QrCode,
  Star,
} from 'lucide-react'
import Link from 'next/link'
import type { Route } from 'next'
import { useEffect, useRef, useState } from 'react'

interface OverviewTabProps {
  campaign: Campaign
  testimonials: Testimonial[]
  qrCodes: QRCode[]
  formUrl: string
}

export function CampaignOverviewTab({
  campaign,
  testimonials,
  qrCodes,
  formUrl,
}: OverviewTabProps) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(formUrl)
    setCopied(true)
    timeoutRef.current = setTimeout(() => setCopied(false), 2000)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Neueste Testimonials (max 5)
  const recentTestimonials = testimonials
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  // Statistiken
  const approvedCount = testimonials.filter((t) => t.status === 'approved').length
  const pendingCount = testimonials.filter((t) => t.status === 'pending').length
  const avgRating =
    testimonials.length > 0
      ? (testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / testimonials.length).toFixed(1)
      : '0.0'

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Linke Spalte: Quick Actions & Info */}
      <div className="space-y-6 lg:col-span-1">
        {/* Quick Actions */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <div className="mt-4 space-y-3">
            <Link
              href={`/app/qr/new?campaign=${campaign.id}`}
              className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <div className="flex items-center space-x-3">
                <QrCode className="h-5 w-5 text-gray-600" />
                <span>QR-Code erstellen</span>
              </div>
              <Plus className="h-4 w-4" />
            </Link>

            <button
              onClick={handleCopyLink}
              className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <div className="flex items-center space-x-3">
                <Copy className="h-5 w-5 text-gray-600" />
                <span>Link kopieren</span>
              </div>
              {copied && <span className="text-xs text-green-600">✓ Kopiert</span>}
            </button>

            <Link
              href={formUrl as Route}
              target="_blank"
              className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <div className="flex items-center space-x-3">
                <ExternalLink className="h-5 w-5 text-gray-600" />
                <span>Formular öffnen</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Formular-Link */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h4 className="text-sm font-semibold text-blue-900">Formular-Link</h4>
          <p className="mt-1 text-xs text-blue-700">
            Teile diesen Link, damit Kunden Testimonials einreichen können.
          </p>
          <div className="mt-3 flex items-center space-x-2">
            <input
              type="text"
              value={formUrl}
              readOnly
              className="flex-1 rounded border border-blue-300 bg-white px-3 py-2 text-sm text-gray-900"
            />
            <button
              onClick={handleCopyLink}
              className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900">Statistiken</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">Genehmigt</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{approvedCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="text-sm text-gray-600">Wartend</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{pendingCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-sm text-gray-600">Durchschnitt</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{avgRating} ★</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <QrCode className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-gray-600">QR-Codes</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{qrCodes.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rechte Spalte: Neueste Aktivitäten */}
      <div className="lg:col-span-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Neueste Testimonials</h3>
            <Link
              href={`/app/kampagnen/${campaign.id}?tab=testimonials`}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Alle anzeigen →
            </Link>
          </div>

          {recentTestimonials.length === 0 ? (
            <div className="mt-6 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Noch keine Testimonials</h3>
              <p className="mt-2 text-sm text-gray-500">
                Teile den Formular-Link, um die ersten Testimonials zu sammeln.
              </p>
              <Button onClick={handleCopyLink} className="mt-4" variant="outline">
                <Copy className="mr-2 h-4 w-4" />
                Link kopieren
              </Button>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {recentTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="rounded-lg border border-gray-200 p-4 hover:border-gray-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{testimonial.name}</span>
                        {testimonial.rating && (
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < testimonial.rating!
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-gray-600">{testimonial.text}</p>
                      <p className="mt-2 text-xs text-gray-500">
                        {new Date(testimonial.created_at).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <span
                      className={`ml-4 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        testimonial.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : testimonial.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {testimonial.status === 'approved'
                        ? 'Genehmigt'
                        : testimonial.status === 'pending'
                          ? 'Wartend'
                          : 'Versteckt'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
