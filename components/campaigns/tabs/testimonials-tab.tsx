// components/campaigns/tabs/testimonials-tab.tsx
// 🎯 Schritt 4C: Testimonials-Tab mit Filterung und Verwaltung

'use client'

import { Button } from '@/components/ui/button'
import type { Campaign, Testimonial, TestimonialStatus } from '@/lib/types'
import { CheckCircle2, Clock, EyeOff, MessageSquare, Search, Star } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface TestimonialsTabProps {
  campaign: Campaign
  testimonials: Testimonial[]
}

type FilterStatus = 'all' | TestimonialStatus

export function CampaignTestimonialsTab({
  campaign: _campaign,
  testimonials,
}: TestimonialsTabProps) {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Filtern
  const filteredTestimonials = testimonials.filter((t) => {
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus
    const matchesSearch =
      searchQuery === '' ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.text.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Statistiken
  const stats = {
    all: testimonials.length,
    pending: testimonials.filter((t) => t.status === 'pending').length,
    approved: testimonials.filter((t) => t.status === 'approved').length,
    hidden: testimonials.filter((t) => t.status === 'hidden').length,
  }

  const handleStatusChange = async (testimonialId: string, newStatus: TestimonialStatus) => {
    try {
      const res = await fetch(`/api/testimonials/${testimonialId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        toast.success('Status aktualisiert', {
          description: `Testimonial wurde als "${newStatus === 'approved' ? 'Genehmigt' : newStatus === 'hidden' ? 'Versteckt' : 'Wartend'}" markiert.`,
        })
        window.location.reload()
      } else {
        const error = await res.json()
        toast.error('Fehler beim Aktualisieren', {
          description: error.error || 'Status konnte nicht aktualisiert werden.',
        })
      }
    } catch (error) {
      console.error('[Testimonials Tab] Error updating status:', error)
      toast.error('Fehler beim Aktualisieren', {
        description: 'Netzwerkfehler. Bitte versuche es erneut.',
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Filter & Suche */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`inline-flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium ${
                filterStatus === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Alle ({stats.all})</span>
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`inline-flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium ${
                filterStatus === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>Wartend ({stats.pending})</span>
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`inline-flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium ${
                filterStatus === 'approved'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Genehmigt ({stats.approved})</span>
            </button>
            <button
              onClick={() => setFilterStatus('hidden')}
              className={`inline-flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium ${
                filterStatus === 'hidden'
                  ? 'bg-gray-200 text-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <EyeOff className="h-4 w-4" />
              <span>Versteckt ({stats.hidden})</span>
            </button>
          </div>

          {/* Suche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Suchen..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Testimonials Liste */}
      <div className="space-y-4">
        {filteredTestimonials.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Keine Testimonials gefunden</h3>
            <p className="mt-2 text-sm text-gray-500">
              {filterStatus !== 'all'
                ? 'Versuche einen anderen Filter.'
                : 'Es wurden noch keine Testimonials eingereicht.'}
            </p>
          </div>
        ) : (
          filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-lg border border-gray-200 bg-white p-6 hover:border-gray-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold text-gray-900">{testimonial.name}</span>
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
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
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

                  {/* Email (optional) */}
                  {testimonial.email && (
                    <p className="mt-1 text-sm text-gray-500">{testimonial.email}</p>
                  )}

                  {/* Text */}
                  <p className="mt-3 text-gray-700">{testimonial.text}</p>

                  {/* Meta */}
                  <div className="mt-4 flex items-center space-x-4 text-xs text-gray-500">
                    <span>
                      Eingereicht:{' '}
                      {new Date(testimonial.created_at).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {testimonial.approved_at && (
                      <span>
                        Genehmigt:{' '}
                        {new Date(testimonial.approved_at).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center space-x-2">
                    {testimonial.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(testimonial.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Genehmigen
                      </Button>
                    )}
                    {testimonial.status !== 'hidden' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(testimonial.id, 'hidden')}
                      >
                        <EyeOff className="mr-2 h-4 w-4" />
                        Verstecken
                      </Button>
                    )}
                    {testimonial.status === 'hidden' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(testimonial.id, 'approved')}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Wieder anzeigen
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
