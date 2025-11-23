// components/campaigns/tabs/qr-tab.tsx
// 🎯 Schritt 4C: QR-Code Tab mit Übersicht und Erstellung

'use client'

import { Button } from '@/components/ui/button'
import type { Campaign, QRCode } from '@/lib/types'
import { Download, Eye, Plus, QrCode as QrCodeIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface QRTabProps {
  campaign: Campaign
  qrCodes: QRCode[]
}

export function CampaignQRTab({ campaign, qrCodes }: QRTabProps) {
  return (
    <div className="space-y-6">
      {/* Header mit Aktion */}
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">QR-Codes ({qrCodes.length})</h3>
          <p className="mt-1 text-sm text-gray-600">
            Erstelle QR-Codes, um Testimonials offline zu sammeln.
          </p>
        </div>
        <Button asChild>
          <Link href={`/app/qr/new?campaign=${campaign.id}`}>
            <Plus className="mr-2 h-4 w-4" />
            Neuer QR-Code
          </Link>
        </Button>
      </div>

      {/* QR-Codes Liste */}
      {qrCodes.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
          <QrCodeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Noch keine QR-Codes</h3>
          <p className="mt-2 text-sm text-gray-500">
            Erstelle deinen ersten QR-Code, um Testimonials offline zu sammeln.
          </p>
          <Button className="mt-4" asChild>
            <Link href={`/app/qr/new?campaign=${campaign.id}`}>
              <Plus className="mr-2 h-4 w-4" />
              Ersten QR-Code erstellen
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {qrCodes.map((qr) => (
            <div
              key={qr.id}
              className="rounded-lg border border-gray-200 bg-white p-6 hover:border-gray-300"
            >
              {/* QR-Code Vorschau */}
              <div className="flex justify-center rounded-lg bg-gray-50 p-4">
                {qr.file_url_png ? (
                  <Image
                    src={qr.file_url_png}
                    alt={qr.title}
                    width={128}
                    height={128}
                    className="h-32 w-32"
                  />
                ) : (
                  <QrCodeIcon className="h-32 w-32 text-gray-400" />
                )}
              </div>

              {/* Info */}
              <div className="mt-4">
                <h4 className="font-semibold text-gray-900">{qr.title}</h4>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                  <span>Scans: {qr.scan_count || 0}</span>
                  {qr.last_scanned_at && (
                    <span>
                      Letzter Scan:{' '}
                      {new Date(qr.last_scanned_at).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center space-x-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/app/qr/${qr.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Details
                  </Link>
                </Button>
                {qr.file_url_svg && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={qr.file_url_svg} download={`${qr.title}.svg`} target="_blank">
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
        <h4 className="font-semibold text-blue-900">So funktionieren QR-Codes</h4>
        <ul className="mt-2 space-y-1 text-sm text-blue-700">
          <li>• Erstelle QR-Codes für verschiedene Standorte oder Zwecke</li>
          <li>• Drucke sie aus oder zeige sie auf Displays an</li>
          <li>• Kunden scannen den Code und gelangen direkt zum Testimonial-Formular</li>
          <li>• Verfolge Scans und Conversion für jeden QR-Code einzeln</li>
        </ul>
      </div>
    </div>
  )
}
