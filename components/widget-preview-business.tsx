'use client'

import { getEnv } from '@/lib/env'
import { createClient } from '@supabase/supabase-js'
import { Check, Copy, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'

interface WidgetPreviewBusinessProps {
  businessId: string
  businessName: string
}

export function WidgetPreviewBusiness({ businessId, businessName }: WidgetPreviewBusinessProps) {
  const [copied, setCopied] = useState(false)
  const [embedType, setEmbedType] = useState<'iframe' | 'script'>('iframe')
  const [reviewCount, setReviewCount] = useState<number | null>(null)

  const env = getEnv()
  const baseUrl = env.APP_BASE_URL || env.NEXT_PUBLIC_APP_URL
  const widgetUrl = `${baseUrl}/widget/${businessId}`
  const scriptUrl = `${baseUrl}/widget.js`

  // Fetch review count
  useEffect(() => {
    async function fetchReviewCount() {
      try {
        // Check if Supabase is configured
        if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          console.warn('Supabase not configured')
          return
        }

        const supabase = createClient(
          env.NEXT_PUBLIC_SUPABASE_URL,
          env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        )

        const { count, error } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true })
          .eq('business_id', businessId)
          .eq('status', 'approved')

        if (!error) {
          setReviewCount(count || 0)
        }
      } catch (err) {
        console.error('Failed to fetch review count:', err)
      } finally {
        // no-op
      }
    }

    fetchReviewCount()
  }, [businessId, env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY])

  // Iframe embed code
  const iframeCode = `<iframe
  src="${widgetUrl}"
  width="100%"
  height="600"
  frameborder="0"
  style="border: none; border-radius: 8px;"
  title="${businessName} Bewertungen"
></iframe>`

  // Script embed code
  const scriptCode = `<div id="kundenmagnet-widget" data-business-id="${businessId}"></div>
<script src="${scriptUrl}" async></script>`

  const embedCode = embedType === 'iframe' ? iframeCode : scriptCode

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Widget einbetten</h2>
          <p className="mt-1 text-sm text-gray-600">
            Zeigen Sie Ihre Bewertungen auf Ihrer Website
          </p>
        </div>
        {reviewCount !== null && (
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{reviewCount}</div>
            <div className="text-sm text-gray-600">Veröffentlichte Bewertungen</div>
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
        <div className="border-b border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Live-Vorschau</h3>
            <a
              href={widgetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <ExternalLink className="h-4 w-4" />
              In neuem Tab öffnen
            </a>
          </div>
        </div>
        <div className="p-4">
          <iframe
            src={widgetUrl}
            className="h-[600px] w-full rounded-lg border-0 bg-white shadow-sm"
            title={`${businessName} Bewertungen Widget`}
          />
        </div>
      </div>

      {/* Embed Code */}
      <div className="space-y-4">
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Einbettungscode auswählen
          </label>

          {/* Tabs */}
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setEmbedType('iframe')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                embedType === 'iframe'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              iFrame (Empfohlen)
            </button>
            <button
              onClick={() => setEmbedType('script')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                embedType === 'script'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              JavaScript
            </button>
          </div>

          {/* Explanation */}
          <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <p className="text-sm text-gray-700">
              {embedType === 'iframe' ? (
                <>
                  <strong>iFrame:</strong> Am einfachsten und sichersten. Widget läuft in einem
                  isolierten Bereich und kann Ihr Layout nicht beeinflussen.
                </>
              ) : (
                <>
                  <strong>JavaScript:</strong> Flexibler und kann sich besser an Ihr Design
                  anpassen. Benötigt JavaScript-Unterstützung im Browser.
                </>
              )}
            </p>
          </div>

          {/* Code Block */}
          <div className="relative">
            <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 font-mono text-sm text-gray-100">
              <code>{embedCode}</code>
            </pre>
            <button
              onClick={copyToClipboard}
              className="absolute right-2 top-2 flex items-center gap-2 rounded-lg bg-gray-800 p-2 transition-colors hover:bg-gray-700"
              title="Code kopieren"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-400">Kopiert!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-gray-300" />
                  <span className="text-sm text-gray-300">Kopieren</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h4 className="mb-2 font-medium text-blue-900">📋 So binden Sie das Widget ein:</h4>
          <ol className="list-inside list-decimal space-y-1 text-sm text-blue-800">
            <li>Kopieren Sie den Code mit dem Button oben</li>
            <li>Öffnen Sie Ihre Website im Editor (z.B. WordPress, Wix, oder direkt im HTML)</li>
            <li>Fügen Sie den Code an der gewünschten Stelle ein</li>
            <li>Speichern und veröffentlichen - fertig! ✅</li>
          </ol>
        </div>

        {/* CMS Guides */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 p-4">
            <h4 className="mb-2 font-semibold">🔧 WordPress</h4>
            <p className="text-sm text-gray-600">
              Fügen Sie den Code in einem „Benutzerdefiniertes HTML&quot;-Block ein oder nutzen Sie
              das Plugin „Insert Headers and Footers&quot;.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <h4 className="mb-2 font-semibold">🎨 Wix</h4>
            <p className="text-sm text-gray-600">
              Gehen Sie zu „Hinzufügen&quot; → „Einbetten&quot; → „HTML iframe&quot; und fügen Sie
              den Code ein.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <h4 className="mb-2 font-semibold">⚡ Webflow</h4>
            <p className="text-sm text-gray-600">
              Fügen Sie ein „Embed&quot;-Element hinzu und kopieren Sie den Code hinein.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <h4 className="mb-2 font-semibold">🛠️ Shopify</h4>
            <p className="text-sm text-gray-600">
              Bearbeiten Sie Ihr Theme und fügen Sie den Code in die gewünschte Template-Datei ein.
            </p>
          </div>
        </div>

        {/* Widget URL Info (nur in Development) */}
        {env.NODE_ENV === 'development' && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <p className="mb-1 text-sm font-medium text-yellow-800">⚠️ Development Mode aktiv</p>
            <p className="text-sm text-yellow-700">
              Widget-URL: <code className="rounded bg-yellow-100 px-1 py-0.5">{widgetUrl}</code>
            </p>
            <p className="mt-2 text-xs text-yellow-600">
              In Production wird automatisch <strong>https://kundenmagnet-app.de</strong> verwendet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
