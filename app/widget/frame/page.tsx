// /app/widget/frame/page.tsx
// Widget-Frame für Embedding: Zeigt nur Testimonials + Auto-Resize per postMessage
// v2.1.0 - Mit Colorful Theme + Horizontal Scroll

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
    .select('id, user_id, name')
    .eq('slug', campaign)
    .eq('status', 'active')
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

  // Theme-Konfiguration (erweitert um colorful + minimal)
  const themeConfig = {
    light: {
      bg: 'bg-white',
      text: 'text-gray-900',
      border: 'border-gray-200',
      card: 'bg-white',
      cardHover: 'hover:shadow-lg',
      star: 'text-yellow-400',
      starFill: 'fill-yellow-400',
      primary: 'text-blue-600',
      secondary: 'text-gray-600',
      gradient: '',
    },
    dark: {
      bg: 'bg-gray-900',
      text: 'text-gray-100',
      border: 'border-gray-700',
      card: 'bg-gray-800',
      cardHover: 'hover:shadow-xl hover:shadow-gray-900/50',
      star: 'text-yellow-400',
      starFill: 'fill-yellow-400',
      primary: 'text-blue-400',
      secondary: 'text-gray-400',
      gradient: '',
    },
    minimal: {
      bg: 'bg-white',
      text: 'text-black',
      border: 'border-gray-300',
      card: 'bg-white',
      cardHover: 'hover:shadow-md',
      star: 'text-black',
      starFill: 'fill-black',
      primary: 'text-black',
      secondary: 'text-gray-600',
      gradient: '',
    },
    colorful: {
      bg: 'bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300',
      text: 'text-gray-900',
      border: 'border-yellow-400',
      card: 'bg-white/95',
      cardHover: 'hover:shadow-xl hover:shadow-pink-300/50',
      star: 'text-red-500',
      starFill: 'fill-red-500',
      primary: 'text-pink-600',
      secondary: 'text-gray-700',
      gradient: 'bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent',
    },
  }

  const currentTheme = themeConfig[theme as keyof typeof themeConfig] || themeConfig.light

  return (
    <div className={`min-h-screen ${currentTheme.bg} p-4`}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className={`mb-6 border-b-2 pb-3 ${currentTheme.border}`}>
          <h2
            className={`text-2xl font-bold ${theme === 'colorful' ? currentTheme.gradient : currentTheme.text}`}
          >
            {campaignData.name}
          </h2>
          {testimonials && testimonials.length > 0 && (
            <p className={`mt-1 text-sm ${currentTheme.secondary}`}>
              {testimonials.length} {testimonials.length === 1 ? 'Bewertung' : 'Bewertungen'}
            </p>
          )}
        </div>

        {/* Horizontal Carousel */}
        <div
          className="flex gap-4 overflow-x-auto overflow-y-hidden pb-4"
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {testimonials?.map((t) => (
            <div
              key={t.id}
              className={`min-w-[280px] max-w-[320px] flex-shrink-0 rounded-lg border p-4 transition-all ${currentTheme.card} ${currentTheme.border} ${currentTheme.cardHover}`}
            >
              {/* Header */}
              <div className="mb-3 flex items-center justify-between">
                <span
                  className={`font-semibold ${theme === 'colorful' ? 'text-pink-600' : currentTheme.text}`}
                >
                  {t.name || 'Anonym'}
                </span>
                <span className={`text-xs ${currentTheme.secondary}`}>
                  {new Date(t.created_at).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              {/* Rating */}
              <div className="mb-2 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= t.rating
                        ? `${currentTheme.starFill} ${currentTheme.star}`
                        : `${currentTheme.border}`
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <p className={`text-sm leading-relaxed ${currentTheme.text}`}>{t.text}</p>
            </div>
          ))}

          {!testimonials?.length && (
            <div className="w-full py-12 text-center">
              <p className={currentTheme.secondary}>Noch keine Bewertungen vorhanden</p>
            </div>
          )}
        </div>

        {/* Footer-Branding */}
        <div className={`mt-8 border-t pt-4 text-center ${currentTheme.border}`}>
          <a
            href="https://kundenmagnet-app.de"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs transition-colors ${currentTheme.primary} hover:opacity-80`}
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
