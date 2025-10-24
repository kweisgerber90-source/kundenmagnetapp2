// /app/widget/frame/page.tsx
// 🔒 Sicherer iFrame für Widget - verwendet Views ohne E-Mail
// Basierend auf ChatGPT Security Review

import { createClient } from '@supabase/supabase-js'
import { Star } from 'lucide-react'
import { Suspense } from 'react'

interface SearchParams {
  campaign?: string
  limit?: string
  sort?: string
  theme?: string
}

async function WidgetFrame({ searchParams }: { searchParams: SearchParams }) {
  const campaign = searchParams.campaign || ''
  const limit = Math.min(Math.max(parseInt(searchParams.limit || '10', 10), 1), 50)
  const sort = (searchParams.sort || 'newest') as 'newest' | 'oldest' | 'rating'
  const theme = searchParams.theme === 'dark' ? 'dark' : 'light'

  if (!campaign) {
    return <div className="p-4 text-red-500">Fehler: Keine Kampagne angegeben</div>
  }

  // Supabase Client (anon key - nur für Views!)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return <div className="p-4 text-red-500">Konfigurationsfehler</div>
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // 🔒 Nur öffentliche Kampagnen-View (ohne user_id)
  const { data: campaignData } = await supabase
    .from('public_campaigns')
    .select('id, name, status, slug')
    .eq('slug', campaign)
    .single()

  if (!campaignData || campaignData.status !== 'active') {
    return <div className="p-4 text-red-500">Kampagne nicht gefunden oder inaktiv</div>
  }

  // 🔒 Öffentliche Testimonials-View (OHNE E-Mail)
  let query = supabase
    .from('public_testimonials')
    .select('id, campaign_id, name, text, rating, created_at')
    .eq('campaign_id', campaignData.id)
    .limit(limit)

  // Sortierung
  switch (sort) {
    case 'oldest':
      query = query.order('created_at', { ascending: true })
      break
    case 'rating':
      query = query
        .order('rating', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
      break
    default: // newest
      query = query.order('created_at', { ascending: false })
  }

  const { data: testimonials } = await query

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-white'}`}>
      <div className="p-4">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {campaignData.name}
        </h3>

        <div className="space-y-4">
          {testimonials?.map((t) => (
            <div
              key={t.id}
              className="rounded-lg border bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-white">{t.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(t.created_at).toLocaleDateString('de-DE')}
                </span>
              </div>

              {t.rating && (
                <div className="mb-2 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= t.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
              )}

              <p className="text-gray-700 dark:text-gray-300">{t.text}</p>
            </div>
          ))}

          {!testimonials?.length && (
            <p className="py-8 text-center text-gray-500 dark:text-gray-400">
              Noch keine Bewertungen vorhanden
            </p>
          )}
        </div>

        <div className="mt-6 border-t pt-4 text-center">
          <a
            href="https://kundenmagnet-app.de"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-blue-600"
          >
            Powered by Kundenmagnet
          </a>
        </div>
      </div>

      {/* Auto-Resize per postMessage */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
(function() {
  function sendHeight() {
    var h = document.body.scrollHeight;
    try { 
      window.parent.postMessage({ type: 'kundenmagnet-resize', height: h }, '*'); 
    } catch(e) {}
  }
  sendHeight();
  window.addEventListener('load', sendHeight);
  window.addEventListener('resize', sendHeight);
  var mo = new MutationObserver(sendHeight);
  mo.observe(document.body, { childList: true, subtree: true });
})();
          `,
        }}
      />
    </div>
  )
}

export default function WidgetFramePage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense
      fallback={
        <div className="p-4 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <WidgetFrame searchParams={searchParams} />
    </Suspense>
  )
}

// SEO: iFrame soll nicht indexiert werden
export const metadata = {
  title: 'Kundenmagnet Widget',
  robots: 'noindex, nofollow',
}
