// /app/app/kampagnen/page.tsx
// 🔧 Korrektur: Kein "as any"; klar typisierte Fehler-UI

import { CampaignDialog } from '@/components/campaigns/campaign-dialog'
import { CampaignList } from '@/components/campaigns/campaign-list'
import { getUser } from '@/lib/supabase/server'
import type { CampaignWithStats } from '@/lib/types/campaign'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function KampagnenPage() {
  const user = await getUser()
  if (!user) redirect('/login')

  const hdrs = headers()
  const proto = hdrs.get('x-forwarded-proto') ?? 'http'
  const host = hdrs.get('host') ?? 'localhost:3000'
  const origin = `${proto}://${host}`

  const res = await fetch(`${origin}/api/campaigns`, {
    headers: { cookie: hdrs.get('cookie') ?? '' },
    cache: 'no-store',
  })

  if (!res.ok) {
    // 🔧 Rückgabe ist reguläres JSX, keine "any"-Casts nötig
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
        Kampagnen konnten nicht geladen werden.
      </div>
    )
  }

  const payload = (await res.json()) as { campaigns: CampaignWithStats[] }
  const { campaigns } = payload

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kampagnen</h1>
          <p className="mt-1 text-sm text-gray-600">Verwalte deine Bewertungskampagnen</p>
        </div>
        <CampaignDialog />
      </div>

      <CampaignList campaigns={campaigns} />
    </div>
  )
}
