// /components/campaigns/campaign-form.tsx
// Formular zum Erstellen/Updaten einer Kampagne (UI-Upgrade, keine Logikänderung)
// - Einheitliche Eingabefelder mit Fokus-/Fehlerzuständen
// - Konsistente Buttons (Primary/Secondary)
// - Klarer Error-Callout, dezente Hinweise
// - Ladeindikator beim Speichern
//
// 🔐 Logik/Requests bleiben unverändert. Kommentare sind auf Deutsch.

'use client'

import type { Campaign, CampaignStatus } from '@/lib/types/campaign'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Mode = 'create' | 'edit'

interface CampaignFormProps {
  campaign?: Campaign // optional bei "create"
  onSaved?: (campaign: Campaign) => void
}

export function CampaignForm({ campaign, onSaved }: CampaignFormProps) {
  const mode: Mode = campaign ? 'edit' : 'create'
  const [name, setName] = useState<string>(campaign?.name ?? '')
  const [slug, setSlug] = useState<string>(campaign?.slug ?? '')
  const [status, setStatus] = useState<CampaignStatus>(campaign?.status ?? 'active')
  const [saving, setSaving] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // 🔧 Einfache Badge-Darstellung für Status (nur UI)
  const StatusBadge = ({ value }: { value: CampaignStatus }) => {
    const styles: Record<CampaignStatus, string> = {
      active: 'bg-green-100 text-green-700 ring-green-200',
      paused: 'bg-yellow-100 text-yellow-700 ring-yellow-200',
      archived: 'bg-gray-100 text-gray-700 ring-gray-200',
    }
    const label: Record<CampaignStatus, string> = {
      active: 'Aktiv',
      paused: 'Pausiert',
      archived: 'Archiviert',
    }
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${styles[value]}`}
        aria-label={`Status: ${label[value]}`}
      >
        {label[value]}
      </span>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      if (mode === 'create') {
        const res = await fetch('/api/campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, slug: slug || undefined }),
        })
        if (!res.ok) {
          const payload = (await res.json().catch(() => ({}))) as { error?: string }
          throw new Error(payload.error ?? 'Unbekannter Fehler beim Erstellen')
        }
        const payload = (await res.json()) as { campaign: Campaign }
        onSaved?.(payload.campaign)
      } else {
        // 🔧 Nur gesendete Felder werden aktualisiert
        const body: Partial<Pick<Campaign, 'name' | 'status'>> = {}
        if (name && name !== campaign!.name) body.name = name
        if (status && status !== campaign!.status) body.status = status

        const res = await fetch(`/api/campaigns/${encodeURIComponent(campaign!.id)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) {
          const payload = (await res.json().catch(() => ({}))) as { error?: string }
          throw new Error(payload.error ?? 'Unbekannter Fehler beim Speichern')
        }
        const payload = (await res.json()) as { campaign: Campaign }
        onSaved?.(payload.campaign)
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Fehlerbox mit klarer Darstellung */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          <div className="flex items-start space-x-2">
            <svg
              className="mt-0.5 h-4 w-4 flex-none"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.5a.75.75 0 00-1.5 0v5a.75.75 0 001.5 0v-5zm0 7.5a.75.75 0 10-1.5 0 .75.75 0 001.5 0z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-medium">Speichern fehlgeschlagen</p>
              <p className="mt-0.5 text-[13px] opacity-90">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Kopfzeile mit Modus & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-gray-500">
          {mode === 'create' ? 'Neue Kampagne' : 'Kampagne bearbeiten'}
        </div>
        {mode === 'edit' && <StatusBadge value={status} />}
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-800">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-[15px] shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          placeholder="z. B. Sommer-Promo"
          required
        />
        <p className="text-xs text-gray-500">
          Wird intern angezeigt und kann jederzeit geändert werden.
        </p>
      </div>

      {/* Slug nur bei Create sichtbar */}
      {mode === 'create' && (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-800">
            Slug <span className="text-gray-400">(optional)</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-2 text-sm text-gray-600">
              /r/
            </div>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-[15px] shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="sommer-2025"
            />
          </div>
          <p className="text-xs text-gray-500">
            Nur Kleinbuchstaben, Zahlen und Bindestriche. Leer lassen, um automatisch zu generieren.
          </p>
        </div>
      )}

      {/* Status-Auswahl im Edit-Modus */}
      {mode === 'edit' && (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-800">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as CampaignStatus)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-[15px] shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="active">Aktiv</option>
            <option value="paused">Pausiert</option>
            <option value="archived">Archiviert</option>
          </select>
          <p className="text-xs text-gray-500">Steuert die Sichtbarkeit/Benutzung der Kampagne.</p>
        </div>
      )}

      {/* Aktionen */}
      <div className="flex items-center justify-end gap-2 pt-2">
        {/* Sekundär-Button (Abbrechen) – nur sinnvoll, wenn form modal ist.
            Lässt sich bei Bedarf via Props aktivieren. */}
        {/* <button type="button" className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Abbrechen
        </button> */}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
          aria-live="polite"
        >
          {saving && (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
          {saving
            ? 'Speichern…'
            : mode === 'create'
              ? 'Kampagne erstellen'
              : 'Änderungen speichern'}
        </button>
      </div>
    </form>
  )
}
