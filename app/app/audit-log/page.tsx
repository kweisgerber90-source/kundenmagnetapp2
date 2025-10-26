// app/app/audit-log/page.tsx
'use client'

// Einfache Audit-Log-Übersicht (nur eigene Einträge).
// Nutzt die API /api/audit-log mit Pagination.

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

type ActorProfile = { id: string; email: string; name: string | null } | null

type AuditLogRow = {
  id: number
  actor: string | null
  action: string
  target: string
  meta: Record<string, unknown> | null
  created_at: string
  actor_profile: ActorProfile
}

type ApiResponse = {
  data: AuditLogRow[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export default function AuditLogPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [rows, setRows] = useState<AuditLogRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') ?? '50', 10)))

  const currentQuery = useMemo(() => {
    const sp = new URLSearchParams(searchParams.toString())
    sp.set('page', String(page))
    sp.set('limit', String(limit))
    return sp.toString()
  }, [searchParams, page, limit])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/audit-log?${currentQuery}`, { cache: 'no-store' })
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      const json: ApiResponse = await res.json()
      setRows(json.data)
    } catch (e: unknown) {
      console.error(e)
      setError('Fehler beim Laden der Audit-Logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuery])

  function goToPage(p: number) {
    const sp = new URLSearchParams(searchParams.toString())
    sp.set('page', String(Math.max(1, p)))
    router.push(`?${sp.toString()}`)
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Aktivitätsprotokoll</h1>
        <div className="flex gap-2">
          <a href="/api/export/audit-logs?format=de" target="_blank" rel="noopener noreferrer">
            <Button>CSV exportieren</Button>
          </a>
          <Button onClick={() => load()}>Aktualisieren</Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="space-y-1">
            <Label>Aktion</Label>
            <Input
              placeholder="z. B. approve_testimonial"
              defaultValue={searchParams.get('action') ?? ''}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const sp = new URLSearchParams(searchParams.toString())
                  const v = (e.target as HTMLInputElement).value.trim()
                  if (v) sp.set('action', v)
                  else sp.delete('action')
                  sp.set('page', '1')
                  router.push(`?${sp.toString()}`)
                }
              }}
            />
          </div>

          <div className="space-y-1">
            <Label>Ziel (ID)</Label>
            <Input
              placeholder="z. B. Testimonial-ID"
              defaultValue={searchParams.get('target') ?? ''}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const sp = new URLSearchParams(searchParams.toString())
                  const v = (e.target as HTMLInputElement).value.trim()
                  if (v) sp.set('target', v)
                  else sp.delete('target')
                  sp.set('page', '1')
                  router.push(`?${sp.toString()}`)
                }
              }}
            />
          </div>

          <div className="space-y-1">
            <Label>Von (ISO)</Label>
            <Input
              placeholder="2025-01-01"
              defaultValue={searchParams.get('date_from') ?? ''}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const sp = new URLSearchParams(searchParams.toString())
                  const v = (e.target as HTMLInputElement).value.trim()
                  if (v) sp.set('date_from', v)
                  else sp.delete('date_from')
                  sp.set('page', '1')
                  router.push(`?${sp.toString()}`)
                }
              }}
            />
          </div>

          <div className="space-y-1">
            <Label>Bis (ISO)</Label>
            <Input
              placeholder="2025-12-31"
              defaultValue={searchParams.get('date_to') ?? ''}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const sp = new URLSearchParams(searchParams.toString())
                  const v = (e.target as HTMLInputElement).value.trim()
                  if (v) sp.set('date_to', v)
                  else sp.delete('date_to')
                  sp.set('page', '1')
                  router.push(`?${sp.toString()}`)
                }
              }}
            />
          </div>
        </div>
      </Card>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr className="text-left">
              <th className="p-3">Zeitpunkt</th>
              <th className="p-3">Aktion</th>
              <th className="p-3">Ziel (ID)</th>
              <th className="p-3">Benutzer</th>
              <th className="p-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="p-3" colSpan={5}>
                  Lädt…
                </td>
              </tr>
            )}
            {error && !loading && (
              <tr>
                <td className="p-3 text-red-600" colSpan={5}>
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && rows.length === 0 && (
              <tr>
                <td className="p-3" colSpan={5}>
                  Keine Einträge
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{new Date(r.created_at).toLocaleString('de-DE')}</td>
                  <td className="p-3 font-mono">{r.action}</td>
                  <td className="p-3 font-mono">{r.target}</td>
                  <td className="p-3">
                    {r.actor_profile?.name ? `${r.actor_profile.name} ` : ''}
                    <span className="text-muted-foreground">{r.actor_profile?.email ?? '—'}</span>
                  </td>
                  <td className="p-3">
                    <pre className="whitespace-pre-wrap break-words text-xs">
                      {JSON.stringify(r.meta ?? {}, null, 2)}
                    </pre>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Seite {page}</div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => goToPage(page - 1)} disabled={page <= 1}>
            Zurück
          </Button>
          <Button onClick={() => goToPage(page + 1)}>Weiter</Button>
        </div>
      </div>
    </div>
  )
}
