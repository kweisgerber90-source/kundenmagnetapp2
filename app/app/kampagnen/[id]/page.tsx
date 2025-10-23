// /app/app/kampagnen/[id]/page.tsx
// 🔧 Neu: Delete-Dialog mit redirectTo zurück zur Liste

import { CampaignForm } from '@/components/campaigns/campaign-form'
import { DeleteCampaignDialog } from '@/components/campaigns/delete-campaign-dialog'
import { getUser } from '@/lib/supabase/server'
import type { Campaign } from '@/lib/types/campaign'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditCampaignPage({ params }: { params: { id: string } }) {
  const user = await getUser()
  if (!user) redirect('/login')

  const { id } = params
  const hdrs = headers()
  const proto = hdrs.get('x-forwarded-proto') ?? 'http'
  const host = hdrs.get('host') ?? 'localhost:3000'
  const origin = `${proto}://${host}`

  const res = await fetch(`${origin}/api/campaigns/${id}`, {
    headers: { cookie: hdrs.get('cookie') ?? '' },
    cache: 'no-store',
  })

  if (res.status === 404) notFound()
  if (!res.ok) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
        Kampagne konnte nicht geladen werden.
      </div>
    )
  }

  const { campaign } = (await res.json()) as { campaign: Campaign }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/app/kampagnen"
          className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Zurück zu Kampagnen</span>
        </Link>

        {/* 🔧 Delete mit Redirect zurück zur Liste */}
        <DeleteCampaignDialog
          campaign={campaign}
          redirectTo="/app/kampagnen"
          trigger={
            <button className="inline-flex items-center space-x-2 rounded-lg p-2 text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
              <span>Löschen</span>
            </button>
          }
        />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-900">Kampagne bearbeiten</h1>
        <p className="mt-1 text-sm text-gray-600">PASSE die Einstellungen deiner Kampagne an</p>

        <div className="mt-6">
          <CampaignForm campaign={campaign} />
        </div>
      </div>
    </div>
  )
}
