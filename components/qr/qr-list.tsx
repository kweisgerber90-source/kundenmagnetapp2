// components/qr/qr-list.tsx
// 📋 QR-Code-Liste mit Grid-Layout
// 🔐 DSGVO: Zeigt nur eigene QR-Codes

'use client'

import { Button } from '@/components/ui/button'
import type { QRCode } from '@/lib/qr/types'
import { QrCode as QrCodeIcon } from 'lucide-react'
import Link from 'next/link'
import { QRCard } from './qr-card'

interface QRListProps {
  qrCodes: QRCode[]
  onDelete?: (id: string) => void
}

export function QRList({ qrCodes, onDelete }: QRListProps) {
  if (qrCodes.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
          <QrCodeIcon className="h-8 w-8 text-indigo-600" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">Keine QR-Codes</h3>
        <p className="mt-2 text-sm text-gray-600">
          Erstellen Sie Ihren ersten QR-Code, um loszulegen.
        </p>
        <Button asChild className="mt-6">
          <Link href={{ pathname: '/app/qr/new' }}>Ersten QR-Code erstellen</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {qrCodes.map((qr) => (
        <QRCard key={qr.id} qr={qr} onDelete={onDelete} />
      ))}
    </div>
  )
}
