// components/qr/qr-download-buttons.tsx
// 💾 Download-Buttons für QR-Code-Dateien
// 🔐 DSGVO: Nur eigene QR-Codes downloadbar

'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useState } from 'react'

interface QRDownloadButtonsProps {
  qrId: string
  title: string
}

export function QRDownloadButtons({ qrId, title }: QRDownloadButtonsProps) {
  const [downloading, setDownloading] = useState<string | null>(null)

  const handleDownload = async (format: 'svg' | 'png' | 'pdf') => {
    setDownloading(format)

    try {
      const response = await fetch(`/api/qr/${qrId}/download?format=${format}`)

      if (!response.ok) {
        throw new Error('Download fehlgeschlagen')
      }

      // Erstelle Download-Link
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download-Fehler:', error)
      alert('Fehler beim Download. Bitte versuchen Sie es erneut.')
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={() => handleDownload('svg')}
        disabled={downloading !== null}
        variant="outline"
      >
        <Download className="mr-2 h-4 w-4" />
        {downloading === 'svg' ? 'Lädt...' : 'SVG herunterladen'}
      </Button>
      <Button
        onClick={() => handleDownload('png')}
        disabled={downloading !== null}
        variant="outline"
      >
        <Download className="mr-2 h-4 w-4" />
        {downloading === 'png' ? 'Lädt...' : 'PNG herunterladen'}
      </Button>
      <Button
        onClick={() => handleDownload('pdf')}
        disabled={downloading !== null}
        variant="outline"
      >
        <Download className="mr-2 h-4 w-4" />
        {downloading === 'pdf' ? 'Lädt...' : 'PDF herunterladen'}
      </Button>
    </div>
  )
}
