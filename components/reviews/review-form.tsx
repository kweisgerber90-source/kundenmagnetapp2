// components/reviews/review-form.tsx
// Öffentliches Bewertungsformular

'use client'

import { submitTestimonialSchema } from '@/lib/validations/testimonial'
import { Loader2 } from 'lucide-react'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { StarRating } from './star-rating'

interface ReviewFormProps {
  campaignSlug: string
  campaignName?: string
}

const CONSENT_TEXT = `Ich stimme zu, dass meine Bewertung verarbeitet und veröffentlicht wird. Meine Daten werden gemäß der Datenschutzerklärung behandelt.`

export function ReviewForm({ campaignSlug, campaignName: _campaignName }: ReviewFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    text: '',
    rating: 0, // 0 = nicht gesetzt; für Schema normalisieren wir auf undefined
    consent: false,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setErrors({})

    // 🔧 Normalisierung für optionale Felder, чтобы схема не ругалась на 0/'':
    const normalized = {
      name: formData.name,
      email: formData.email || undefined,
      text: formData.text,
      rating: formData.rating || undefined,
      consent: formData.consent,
    }

    // Client-seitige Validierung
    const validation = submitTestimonialSchema.safeParse(normalized)
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {}
      validation.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message
      })
      setErrors(fieldErrors)
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/testimonials/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: campaignSlug,
          name: normalized.name,
          email: normalized.email ?? null,
          text: normalized.text,
          rating: normalized.rating ?? null,
          consent: normalized.consent, // 🔧 сервер ожидает consent=true
          consentText: CONSENT_TEXT,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Fehler beim Absenden')

      // 🔧 typedRoutes: приводим строку к Route и редиректим без несериализуемого onSuccess
      const url = `/r/${campaignSlug}?success=true` as Route
      router.replace(url)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unbekannter Fehler'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Ihr Name *
        </label>
        <input
          id="name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Max Mustermann"
          disabled={loading}
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>

      {/* E-Mail (optional) */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          E-Mail-Adresse (optional)
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="max@beispiel.de"
          disabled={loading}
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        <p className="mt-1 text-xs text-gray-500">
          Optional: Für Rückfragen oder Updates zu Ihrer Bewertung
        </p>
      </div>

      {/* Sterne-Bewertung */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Bewertung (optional)</label>
        <div className="mt-2">
          <StarRating
            value={formData.rating}
            onChange={(rating: number) => setFormData({ ...formData, rating })}
            disabled={loading}
          />
        </div>
        {errors.rating && <p className="mt-1 text-xs text-red-600">{errors.rating}</p>}
      </div>

      {/* Bewertungstext */}
      <div>
        <label htmlFor="text" className="block text-sm font-medium text-gray-700">
          Ihre Bewertung *
        </label>
        <textarea
          id="text"
          required
          rows={6}
          value={formData.text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Teilen Sie Ihre Erfahrung mit uns..."
          disabled={loading}
        />
        <div className="mt-1 flex justify-between text-xs">
          {errors.text ? (
            <p className="text-red-600">{errors.text}</p>
          ) : (
            <p className="text-gray-500">Mindestens 10 Zeichen</p>
          )}
          <p className="text-gray-500">{formData.text.length} / 2000</p>
        </div>
      </div>

      {/* Datenschutz-Consent */}
      <div className="rounded-lg bg-gray-50 p-4">
        <div className="flex items-start space-x-3">
          <input
            id="consent"
            type="checkbox"
            checked={formData.consent}
            onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            disabled={loading}
          />
          <label htmlFor="consent" className="text-sm text-gray-700">
            {CONSENT_TEXT} {/* 🔧 фикс разметки: корректная ссылка */}
            <a
              href="/legal/datenschutz"
              target="_blank"
              className="text-blue-600 hover:underline"
              rel="noreferrer"
            >
              Datenschutzerklärung
            </a>
          </label>
        </div>
        {errors.consent && <p className="mt-2 text-xs text-red-600">{errors.consent}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        <span>{loading ? 'Wird gesendet...' : 'Bewertung absenden'}</span>
      </button>

      <p className="text-center text-xs text-gray-500">
        Ihre Bewertung wird vor Veröffentlichung geprüft
      </p>
    </form>
  )
}
