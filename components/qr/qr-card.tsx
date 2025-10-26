// components/qr/qr-card.tsx
// 🎴 QR-Code-Karte für die Übersicht
// 🔐 DSGVO: Zeigt nur eigene QR-Codes

'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { QRCode } from '@/lib/qr/types'
import { Download, Eye, QrCode as QrCodeIcon, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface QRCardProps {
  qr: QRCode
  onDelete?: (id: string) => void
}

export function QRCard({ qr, onDelete }: QRCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{qr.title}</CardTitle>
            <CardDescription className="mt-1">
              Kampagne: {(qr as QRCode & { campaigns: { name: string } }).campaigns?.name}
            </CardDescription>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
            <QrCodeIcon className="h-6 w-6 text-indigo-600" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Scans gesamt:</span>
          <span className="font-semibold text-gray-900">{qr.scan_count}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Erstellt:</span>
          <span className="text-gray-700">{formatDate(qr.created_at)}</span>
        </div>
        {qr.last_scanned_at && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Zuletzt gescannt:</span>
            <span className="text-gray-700">{formatDate(qr.last_scanned_at)}</span>
          </div>
        )}
        <div className="border-t pt-2">
          <div className="text-xs text-gray-500">Public ID:</div>
          <code className="mt-1 block rounded bg-gray-100 px-2 py-1 text-xs">{qr.public_id}</code>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" asChild className="flex-1">
          <Link href={{ pathname: '/app/qr/[id]', query: { id: qr.id } }}>
            <Eye className="mr-2 h-4 w-4" />
            Details
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={`/app/qr/${qr.id}/download`}>
            <Download className="h-4 w-4" />
          </a>
        </Button>
        {onDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(qr.id)}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
