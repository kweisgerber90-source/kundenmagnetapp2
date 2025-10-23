// Öffentliches Bewertungsformular
// 🔧 Korrektur: Import des Danke-Components; BRAND.name statt BRAND.productName

import { ReviewForm } from '@/components/reviews/review-form'
import { ReviewThankYou } from '@/components/reviews/review-thank-you'
import { BRAND } from '@/lib/constants'
import { getEnv } from '@/lib/env'
import { createClient } from '@supabase/supabase-js'
import { MessageSquare } from 'lucide-react'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const preferredRegion = ['fra1']

interface PageProps {
  params: { slug: string }
  searchParams: { success?: string }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = params
  const env = getEnv()
  const supa = createClient(env.NEXT_PUBLIC_SUPABASE_URL || '', env.SUPABASE_SERVICE_ROLE_KEY || '')
  const { data: campaign } = await supa
    .from('campaigns')
    .select('name')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  const title = campaign ? `Bewertung abgeben für ${campaign.name}` : 'Bewertung abgeben'
  return {
    title: `${title} | ${BRAND.name}`,
    description: 'Teilen Sie Ihre Erfahrung und helfen Sie anderen Kunden.',
    robots: 'noindex, nofollow',
  }
}

export default async function ReviewPage({ params, searchParams }: PageProps) {
  const { slug } = params
  const showThankYou = searchParams.success === 'true'

  const env = getEnv()
  const supa = createClient(env.NEXT_PUBLIC_SUPABASE_URL || '', env.SUPABASE_SERVICE_ROLE_KEY || '')
  const { data: campaign, error } = await supa
    .from('campaigns')
    .select('id, name, slug, status')
    .eq('slug', slug)
    .single()

  if (error || !campaign) notFound()

  if (campaign.status !== 'active') {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <MessageSquare className="h-8 w-8 text-yellow-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Kampagne nicht verfügbar</h2>
          <p className="mt-2 text-gray-600">
            Diese Bewertungskampagne ist derzeit pausiert oder wurde archiviert.
          </p>
        </div>
      </div>
    )
  }

  if (showThankYou) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <ReviewThankYou />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
          <p className="mt-2 text-gray-600">
            Ihre Meinung ist uns wichtig. Teilen Sie Ihre Erfahrung!
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg md:p-8">
          <ReviewForm campaignSlug={campaign.slug} />
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Powered by{' '}
            <a href="/" className="text-blue-600 hover:underline">
              {BRAND.name}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
