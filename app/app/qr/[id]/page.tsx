// app/app/qr/[id]/page.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Copy, Download, ExternalLink, Loader2, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface QRCodeDetails {
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
    slug: string
  } | null
}

export default function QRDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [qrCode, setQrCode] = useState<QRCodeDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  const publicUrl = qrCode 
  ? `${process.env.NEXT_PUBLIC_APP_BASE_URL || window.location.origin}/q/${qrCode.public_id}` 
  : ''

  useEffect(() => {
    loadQRCode()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const loadQRCode = async () => {
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
          campaigns!inner(name, slug)
        `,
        )
        .eq('id', params.id)
        .single()

      if (error) {
        console.error('Fehler beim Laden:', error)
        router.push('/app/qr')
        return
      }

      // Transform data
      const transformedData = {
        ...data,
        campaigns: Array.isArray(data.campaigns) ? data.campaigns[0] : data.campaigns,
      }

      setQrCode(transformedData as QRCodeDetails)
    } catch (err) {
      console.error('Fehler:', err)
      router.push('/app/qr')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (format: 'svg' | 'png') => {
    if (!qrCode) return

    try {
      const response = await fetch(`/api/qr/${qrCode.id}/download?format=${format}`)
      if (!response.ok) throw new Error('Download fehlgeschlagen')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${qrCode.title.replace(/[^a-zA-Z0-9]/g, '_')}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Download-Fehler:', err)
      alert(`Fehler beim Download der ${format.toUpperCase()}-Datei`)
    }
  }

  const handleDelete = async () => {
    if (!qrCode) return
    if (!confirm(`Möchten Sie "${qrCode.title}" wirklich löschen?`)) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/qr/${qrCode.id}/delete`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Löschen fehlgeschlagen')
      }

      router.push('/app/qr')
    } catch (err) {
      console.error('Fehler beim Löschen:', err)
      alert('Fehler beim Löschen des QR-Codes')
    } finally {
      setDeleting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('In Zwischenablage kopiert!')
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!qrCode) {
    return (
      <div className="text-center">
        <p className="text-gray-600">QR-Code nicht gefunden</p>
        <Button asChild className="mt-4">
          <Link href="/app/qr">Zurück zur Übersicht</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/app/qr">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur Übersicht
          </Link>
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{qrCode.title}</h1>
            <p className="mt-2 text-gray-600">
              Erstellt am {new Date(qrCode.created_at).toLocaleDateString('de-DE')}
            </p>
          </div>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Löschen
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* QR-Code Vorschau */}
        <Card>
          <CardHeader>
            <CardTitle>QR-Code</CardTitle>
            <CardDescription>Scannen Sie den Code zum Testen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center rounded-lg bg-gray-50 p-8">
              {qrCode.file_url_png ? (
                <Image
                  src={`/api/qr/${qrCode.id}/image?format=png`}
                  alt={qrCode.title}
                  width={300}
                  height={300}
                  className="rounded-lg"
                />
              ) : (
                <div className="flex h-[300px] w-[300px] items-center justify-center text-gray-400">
                  <span>Keine Vorschau verfügbar</span>
                </div>
              )}
            </div>

            {/* Downloads */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button onClick={() => handleDownload('svg')} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                SVG
              </Button>
              <Button onClick={() => handleDownload('png')} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                PNG
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informationen */}
        <div className="space-y-6">
          {/* Kampagne */}
          <Card>
            <CardHeader>
              <CardTitle>Kampagne</CardTitle>
            </CardHeader>
            <CardContent>
              {qrCode.campaigns ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{qrCode.campaigns.name}</p>
                    <p className="text-sm text-gray-500">/{qrCode.campaigns.slug}</p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/app/kampagnen/${qrCode.campaign_id}`}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <p className="text-gray-500">Keine Kampagne verknüpft</p>
              )}
            </CardContent>
          </Card>

          {/* Öffentliche URL */}
          <Card>
            <CardHeader>
              <CardTitle>Öffentliche URL</CardTitle>
              <CardDescription>
                Diese URL leitet Nutzer zu Ihrem Bewertungsformular weiter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input value={publicUrl} readOnly className="font-mono text-sm" />
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(publicUrl)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" asChild className="w-full">
                <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  URL testen
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Statistiken */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Scans gesamt</span>
                  <span className="text-2xl font-bold">{qrCode.scan_count || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Public ID</span>
                  <code className="rounded bg-gray-100 px-2 py-1 text-sm">{qrCode.public_id}</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Input({
  value,
  readOnly,
  className,
}: {
  value: string
  readOnly: boolean
  className: string
}) {
  return <input type="text" value={value} readOnly={readOnly} className={className} />
}
