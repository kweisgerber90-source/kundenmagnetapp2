// components/export/csv-export-button.tsx
/**
 * CSV-Export-Button Komponente
 * Vereinfacht den CSV-Download aus der UI
 */

'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface CSVExportButtonProps {
  /**
   * API-Endpoint für den Export
   * z.B. '/api/export/testimonials'
   */
  endpoint: string

  /**
   * Query-Parameter für den Export
   * z.B. { campaign_id: '123', status: 'approved' }
   */
  params?: Record<string, string>

  /**
   * Button-Text
   */
  label?: string

  /**
   * Button-Variante
   */
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'

  /**
   * Button-Größe
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * CSS-Klassen
   */
  className?: string

  /**
   * Callback bei Erfolg
   */
  onSuccess?: () => void

  /**
   * Callback bei Fehler
   */
  onError?: (error: Error) => void
}

export function CSVExportButton({
  endpoint,
  params = {},
  label = 'CSV exportieren',
  variant = 'outline',
  size = 'md',
  className,
  onSuccess,
  onError,
}: CSVExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    try {
      setIsExporting(true)

      // Query-String erstellen
      const queryString = new URLSearchParams(params).toString()
      const url = queryString ? `${endpoint}?${queryString}` : endpoint

      // API-Request
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'text/csv',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unbekannter Fehler' }))
        throw new Error(errorData.error || 'Export fehlgeschlagen')
      }

      // Dateiname aus Content-Disposition Header extrahieren
      const contentDisposition = response.headers.get('Content-Disposition')
      const filenameMatch = contentDisposition?.match(/filename="?([^"]+)"?/)
      const filename = filenameMatch?.[1] || 'export.csv'

      // CSV als Blob herunterladen
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // URL freigeben
      window.URL.revokeObjectURL(downloadUrl)

      // Erfolgs-Toast
      toast.success('CSV erfolgreich exportiert', {
        description: `Datei: ${filename}`,
      })

      // Callback
      onSuccess?.()
    } catch (error) {
      console.error('CSV export error:', error)

      const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler'

      toast.error('Export fehlgeschlagen', {
        description: errorMessage,
      })

      // Callback
      onError?.(error instanceof Error ? error : new Error(errorMessage))
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      variant={variant}
      size={size}
      className={className}
    >
      <Download className="mr-2 h-4 w-4" />
      {isExporting ? 'Exportiere...' : label}
    </Button>
  )
}
