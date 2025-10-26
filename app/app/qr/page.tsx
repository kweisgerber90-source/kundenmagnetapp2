// app/app/qr/page.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { Book, Copy, Download, ExternalLink, Eye, Plus, RefreshCw, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface QRCode {
  id: string
  public_id: string
  title: string
  created_at: string
  file_url_svg: string | null
  file_url_png: string | null
  scan_count: number
  campaign_id: string
  campaigns?: {
    name: string
  } | null
}

export default function QRPage() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const loadQRCodes = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('qr_codes')
        .select(
          `
          id,
          public_id,
          title,
          created_at,
          file_url_svg,
          file_url_png,
          scan_count,
          campaign_id,
          campaigns!inner(name)
        `,
        )
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Fehler beim Laden der QR-Codes:', error)
        return
      }

      const transformedData = (data || []).map((item) => ({
        ...item,
        campaigns: Array.isArray(item.campaigns) ? item.campaigns[0] : item.campaigns,
      }))

      setQrCodes(transformedData as QRCode[])
    } catch (err) {
      console.error('Fehler:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diesen QR-Code wirklich löschen?')) return

    setDeleting(id)
    try {
      const response = await fetch(`/api/qr/${id}/delete`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Löschen fehlgeschlagen')
      }

      await loadQRCodes()
    } catch (err) {
      console.error('Fehler beim Löschen:', err)
      alert('Fehler beim Löschen des QR-Codes')
    } finally {
      setDeleting(null)
    }
  }

  const handleDownload = async (id: string, format: 'svg' | 'png') => {
    try {
      const response = await fetch(`/api/qr/${id}/download?format=${format}`)
      if (!response.ok) throw new Error('Download fehlgeschlagen')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `qr-${id}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Download-Fehler:', err)
      alert(`Fehler beim Download der ${format.toUpperCase()}-Datei`)
    }
  }

  const copyPublicUrl = (publicId: string) => {
    const url = `${window.location.origin}/q/${publicId}`
    navigator.clipboard.writeText(url)
    setCopiedId(publicId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  useEffect(() => {
    loadQRCodes()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-gray-400" />
          <p className="mt-4 text-gray-600">Lade QR-Codes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header mit Navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">QR-Codes</h1>
          <p className="mt-2 text-gray-600">
            Erstellen, verwalten und verfolgen Sie Ihre QR-Codes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/docs/qr">
              <Book className="mr-2 h-4 w-4" />
              Dokumentation
            </Link>
          </Button>
          <Button onClick={loadQRCodes} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Aktualisieren
          </Button>
          <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700">
            <Link href="/app/qr/new">
              <Plus className="mr-2 h-4 w-4" />
              Neuer QR-Code
            </Link>
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Book className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">QR-Codes für Offline-Bewertungen</p>
              <p className="text-xs text-blue-700">
                Drucken Sie QR-Codes aus und sammeln Sie Bewertungen vor Ort
              </p>
            </div>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            <Link href="/docs/qr">
              Mehr erfahren
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* QR-Code Liste */}
      {qrCodes.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Noch keine QR-Codes</h3>
            <p className="mb-6 text-gray-600">
              Erstellen Sie Ihren ersten QR-Code, um Offline-Bewertungen zu sammeln.
            </p>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
              <Link href="/app/qr/new">
                <Plus className="mr-2 h-4 w-4" />
                Ersten QR-Code erstellen
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {qrCodes.map((qr) => (
            <Card key={qr.id} className="relative overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">{qr.title}</CardTitle>
                <CardDescription>
                  {qr.campaigns?.name && (
                    <span className="block text-sm">Kampagne: {qr.campaigns.name}</span>
                  )}
                  <span className="block text-xs text-gray-500">
                    Scans: {qr.scan_count || 0} • Erstellt am{' '}
                    {new Date(qr.created_at).toLocaleDateString('de-DE')}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* QR-Code Vorschau */}
                <div className="flex justify-center rounded-lg bg-gray-50 p-4">
                  {qr.file_url_png ? (
                    <Image
                      src={`/api/qr/${qr.id}/image?format=png`}
                      alt={qr.title}
                      width={200}
                      height={200}
                      className="rounded-lg"
                    />
                  ) : (
                    <div className="flex h-[200px] w-[200px] items-center justify-center text-gray-400">
                      <span className="text-sm">Keine Vorschau</span>
                    </div>
                  )}
                </div>

                {/* Öffentliche URL */}
                <div className="rounded-lg border bg-gray-50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">Öffentlicher Link:</span>
                    <Button
                      onClick={() => copyPublicUrl(qr.public_id)}
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                    >
                      {copiedId === qr.public_id ? (
                        <>✓ Kopiert</>
                      ) : (
                        <>
                          <Copy className="mr-1 h-3 w-3" />
                          Kopieren
                        </>
                      )}
                    </Button>
                  </div>
                  <code className="block truncate text-xs text-gray-600">/q/{qr.public_id}</code>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {/* Download Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleDownload(qr.id, 'svg')}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      SVG
                    </Button>
                    <Button
                      onClick={() => handleDownload(qr.id, 'png')}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      PNG
                    </Button>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/app/qr/${qr.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Details
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/q/${qr.public_id}`} target="_blank">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Testen
                      </Link>
                    </Button>
                  </div>

                  {/* Delete Button */}
                  <Button
                    onClick={() => handleDelete(qr.id)}
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    disabled={deleting === qr.id}
                  >
                    {deleting === qr.id ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Löschen
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
