// /app/app/testimonials/page.tsx
'use client'

// ----------------------------------------------------------------------------
// Testimonials Moderation (Schritt 3D)
// - Lädt Testimonials (RLS sorgt für Nutzer-Scope)
// - Aktionen: Approve, Hide, Anonymize, Soft-Delete
// - Benachrichtigung via sonner
// ----------------------------------------------------------------------------

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client' // 🔧 Korrektur: vorhandenen Browser-Client verwenden
import { CheckCircle, EyeOff, MessageSquare, Trash2, UserX, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type Status = 'pending' | 'approved' | 'hidden'

// 🔧 Korrektur: Eigene Typen, weil types/database.ts nicht mit dem Schema übereinstimmt.
type CampaignRef = { name: string | null; slug: string | null } | null
type Testimonial = {
  id: string
  campaign_id: string
  name: string | null
  email: string | null
  text: string
  rating: number | null
  status: Status
  approved_at: string | null
  anonymized_at: string | null
  deleted_at: string | null
  created_at: string
  campaigns?: CampaignRef
}

export default function TestimonialsPage() {
  const supabase = createClient()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Status>('pending')

  async function loadData() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('testimonials')
        .select(`*, campaigns ( name, slug )`)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTestimonials((data as unknown as Testimonial[]) ?? [])
    } catch (err) {
      console.error('[testimonials] load error', err)
      toast.error('Fehler beim Laden der Testimonials')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = testimonials.filter((t) => !t.deleted_at && t.status === activeTab)

  function stars(rating: number | null) {
    const r = rating ?? 0
    return '★'.repeat(Math.max(0, Math.min(5, r))) + '☆'.repeat(Math.max(0, 5 - r))
  }

  async function approve(id: string) {
    try {
      const { data, error } = await supabase.rpc('approve_testimonial', { p_testimonial_id: id })
      if (error || !data) throw error ?? new Error('RPC returned falsy')
      toast.success('Testimonial genehmigt')
      await loadData()
    } catch (err) {
      console.error('[testimonials] approve error', err)
      toast.error('Fehler beim Genehmigen')
    }
  }

  async function hide(id: string) {
    try {
      // 🔧 Korrektur: Nutzung einer RPC-Funktion mit SECURITY DEFINER statt clientseitigem Update + Audit-Insert
      const { data, error } = await supabase.rpc('hide_testimonial', { p_testimonial_id: id })
      if (error || !data) throw error ?? new Error('RPC returned falsy')
      toast.success('Testimonial versteckt')
      await loadData()
    } catch (err) {
      console.error('[testimonials] hide error', err)
      toast.error('Fehler beim Verstecken')
    }
  }

  async function anonymize(id: string) {
    try {
      const { data, error } = await supabase.rpc('anonymize_testimonial', { p_testimonial_id: id })
      if (error || !data) throw error ?? new Error('RPC returned falsy')
      toast.success('Testimonial anonymisiert')
      await loadData()
    } catch (err) {
      console.error('[testimonials] anonymize error', err)
      toast.error('Fehler beim Anonymisieren')
    }
  }

  async function softDelete(id: string) {
    try {
      if (!confirm('Möchten Sie dieses Testimonial wirklich löschen?')) return
      const { data, error } = await supabase.rpc('soft_delete_testimonial', {
        p_testimonial_id: id,
      })
      if (error || !data) throw error ?? new Error('RPC returned falsy')
      toast.success('Testimonial gelöscht')
      await loadData()
    } catch (err) {
      console.error('[testimonials] delete error', err)
      toast.error('Fehler beim Löschen')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
          <p className="mt-4 text-gray-600">Lade Testimonials...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
            <MessageSquare className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
            <p className="text-gray-600">Moderieren Sie Kundenbewertungen</p>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as Status)}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="gap-2">
            <XCircle className="h-4 w-4" />
            Ausstehend
            <Badge variant="secondary" className="ml-2">
              {testimonials.filter((t) => t.status === 'pending' && !t.deleted_at).length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Genehmigt
            <Badge variant="secondary" className="ml-2">
              {testimonials.filter((t) => t.status === 'approved' && !t.deleted_at).length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="hidden" className="gap-2">
            <EyeOff className="h-4 w-4" />
            Versteckt
            <Badge variant="secondary" className="ml-2">
              {testimonials.filter((t) => t.status === 'hidden' && !t.deleted_at).length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <XCircle className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600">Keine ausstehenden Testimonials</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((t) => (
              <Card key={t.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {t.name || 'Anonym'}
                        {t.anonymized_at && (
                          <Badge variant="secondary" className="ml-2">
                            Anonymisiert
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{t.email || 'Keine E-Mail'}</CardDescription>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                        <span className="text-yellow-500">{stars(t.rating)}</span>
                        <Badge variant="outline">
                          {t.campaigns?.name || 'Unbekannte Kampagne'}
                        </Badge>
                        <span>{new Date(t.created_at).toLocaleDateString('de-DE')}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-gray-700">{t.text}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => approve(t.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Genehmigen
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => hide(t.id)}>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Verstecken
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => anonymize(t.id)}>
                      <UserX className="mr-2 h-4 w-4" />
                      Anonymisieren
                    </Button>
                    {/* 🔧 Korrektur: Button-Variante an das lokale Design System angepasst */}
                    <Button size="sm" variant="danger" onClick={() => softDelete(t.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Löschen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600">Keine genehmigten Testimonials</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((t) => (
              <Card key={t.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {t.name || 'Anonym'}
                        {t.anonymized_at && (
                          <Badge variant="secondary" className="ml-2">
                            Anonymisiert
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{t.email || 'Keine E-Mail'}</CardDescription>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                        <span className="text-yellow-500">{stars(t.rating)}</span>
                        <Badge variant="outline">
                          {t.campaigns?.name || 'Unbekannte Kampagne'}
                        </Badge>
                        <span>
                          Genehmigt:{' '}
                          {new Date(t.approved_at ?? t.created_at).toLocaleDateString('de-DE')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-gray-700">{t.text}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => hide(t.id)}>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Verstecken
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => anonymize(t.id)}>
                      <UserX className="mr-2 h-4 w-4" />
                      Anonymisieren
                    </Button>
                    {/* 🔧 Korrektur: Button-Variante an das lokale Design System angepasst */}
                    <Button size="sm" variant="danger" onClick={() => softDelete(t.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Löschen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="hidden" className="space-y-4">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <EyeOff className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600">Keine versteckten Testimonials</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((t) => (
              <Card key={t.id} className="opacity-75">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {t.name || 'Anonym'}
                        {t.anonymized_at && (
                          <Badge variant="secondary" className="ml-2">
                            Anonymisiert
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{t.email || 'Keine E-Mail'}</CardDescription>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                        <span className="text-yellow-500">{stars(t.rating)}</span>
                        <Badge variant="outline">
                          {t.campaigns?.name || 'Unbekannte Kampagne'}
                        </Badge>
                        <span>{new Date(t.created_at).toLocaleDateString('de-DE')}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-gray-700">{t.text}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => approve(t.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Genehmigen
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => anonymize(t.id)}>
                      <UserX className="mr-2 h-4 w-4" />
                      Anonymisieren
                    </Button>
                    {/* 🔧 Korrektur: Button-Variante an das lokale Design System angepasst */}
                    <Button size="sm" variant="danger" onClick={() => softDelete(t.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Löschen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
