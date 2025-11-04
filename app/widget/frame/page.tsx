// /app/widget/frame/page.tsx
// Widget-Frame für Embedding: Zeigt nur Testimonials + Auto-Resize per postMessage

import { createClient } from '@/lib/supabase/server'
import { Star } from 'lucide-react'
import { Suspense } from 'react'

type SearchParams = {
  campaign?: string
  limit?: string
  sort?: string
  theme?: string
}

async function WidgetFrame({ searchParams }: { searchParams: SearchParams }) {
  const { campaign, limit = '10', sort = 'newest', theme = 'light' } = searchParams

  // Validierung
  if (!campaign) {
    return (
      <div className="p-6 text-center text-red-600">
        <p className="font-semibold">Fehler: Kein Kampagnen-Slug angegeben</p>
        <p className="mt-2 text-sm">Bitte fügen Sie ?campaign=ihr-slug zur URL hinzu</p>
      </div>
    )
  }

  // Limit: 1-50, Default 10
  const numLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 50)

  // Sort: newest | oldest | highest | lowest
  const validSort = ['newest', 'oldest', 'highest', 'lowest'].includes(sort) ? sort : 'newest'

  // Supabase Query
  const supabase = await createClient()

  const { data: campaignData } = await supabase
    .from('campaigns')
    .select('id, business_id, name')
    .eq('slug', campaign)
    .eq('is_active', true)
    .single()

  if (!campaignData) {
    return (
      <div className="p-6 text-center text-red-600">
        <p className="font-semibold">Kampagne nicht gefunden</p>
        <p className="mt-2 text-sm">Die angegebene Kampagne existiert nicht oder ist deaktiviert</p>
      </div>
    )
  }

  // Testimonials abfragen (nur freigegebene)
  let query = supabase
    .from('testimonials')
    .select('id, rating, name, text, created_at')
    .eq('campaign_id', campaignData.id)
    .eq('status', 'approved')
    .limit(numLimit)

  // Sortierung
  switch (validSort) {
    case 'oldest':
      query = query.order('created_at', { ascending: true })
      break
    case 'highest':
      query = query.order('rating', { ascending: false }).order('created_at', { ascending: false })
      break
    case 'lowest':
      query = query.order('rating', { ascending: true }).order('created_at', { ascending: false })
      break
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false })
  }

  const { data: testimonials } = await query

  // Theme-Klassen
  const isDark = theme === 'dark'
  const bgClass = isDark ? 'bg-gray-900' : 'bg-white'
  const textClass = isDark ? 'text-gray-100' : 'text-gray-900'
  const cardClass = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} p-4`}>
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">{campaignData.name}</h2>
          {testimonials && testimonials.length > 0 && (
            <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {testimonials.length} {testimonials.length === 1 ? 'Bewertung' : 'Bewertungen'}
            </p>
          )}
        </div>

        {/* Testimonials */}
        <div className="space-y-4">
          {testimonials?.map((t) => (
            <div key={t.id} className={`rounded-lg border p-4 shadow-sm ${cardClass}`}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold">{t.name || 'Anonym'}</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= t.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : isDark
                            ? 'text-gray-600'
                            : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t.text}</p>
              <p className={`mt-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                {new Date(t.created_at).toLocaleDateString('de-DE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          ))}

          {!testimonials?.length && (
            <div className="py-12 text-center">
              <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                Noch keine Bewertungen vorhanden
              </p>
            </div>
          )}
        </div>

        {/* Footer-Branding */}
        <div
          className={`mt-8 border-t pt-4 text-center ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <a
            href="https://kundenmagnet-app.de"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs transition-colors ${
              isDark ? 'text-gray-500 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            Powered by Kundenmagnet
          </a>
        </div>
      </div>

      {/* Auto-Resize Script (sendet Höhe an Parent-Window) */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
(function() {
  function sendHeight() {
    var height = document.documentElement.scrollHeight;
    try {
      window.parent.postMessage(
        { type: 'kundenmagnet-resize', height: height },
        '*'
      );
    } catch (e) {
      console.error('postMessage failed:', e);
    }
  }

  // Initial
  sendHeight();

  // Nach Load
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', sendHeight);
  }
  window.addEventListener('load', sendHeight);

  // Bei Resize
  window.addEventListener('resize', sendHeight);

  // Bei DOM-Änderungen (z.B. Bilder laden)
  var observer = new MutationObserver(sendHeight);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });
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
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      }
    >
      <WidgetFrame searchParams={searchParams} />
    </Suspense>
  )
}
