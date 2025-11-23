// components/campaigns/tabs/widget-tab.tsx
// 🎯 Schritt 4C: Widget-Tab mit Einbettungscode und Vorschau

'use client'

import { Button } from '@/components/ui/button'
import { Check, Code, Copy, Eye } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import type { Campaign } from '@/lib/types'

interface WidgetTabProps {
  campaign: Campaign
  widgetUrl: string
}

export function CampaignWidgetTab({ campaign, widgetUrl }: WidgetTabProps) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const embedCode = `<!-- Kundenmagnet Widget -->
<div id="kundenmagnet-widget" data-campaign="${campaign.slug}"></div>
<script src="${widgetUrl}" async></script>`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(embedCode)
    setCopied(true)
    timeoutRef.current = setTimeout(() => setCopied(false), 2000)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Widget Einbettung */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Widget einbetten
          </h3>
          <Button onClick={handleCopy} variant="outline" size="sm">
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Kopiert!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Code kopieren
              </>
            )}
          </Button>
        </div>

        <p className="mt-2 text-sm text-gray-600">
          Füge diesen Code in deine Website ein, um die Testimonials anzuzeigen.
        </p>

        <div className="mt-4 rounded-lg bg-gray-900 p-4">
          <pre className="overflow-x-auto text-sm text-gray-100">
            <code>{embedCode}</code>
          </pre>
        </div>

        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Code className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-900">
                Anleitung
              </h4>
              <div className="mt-2 text-sm text-blue-700">
                <ol className="list-decimal space-y-1 pl-5">
                  <li>Kopiere den obigen Code</li>
                  <li>
                    Füge ihn an der Stelle ein, wo die Testimonials erscheinen
                    sollen
                  </li>
                  <li>
                    Das Widget lädt automatisch nur genehmigte Testimonials
                  </li>
                  <li>
                    Das Design passt sich automatisch an deine Website an
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Widget Vorschau */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Widget-Vorschau
          </h3>
          <Button variant="outline" size="sm" asChild>
            <a href={`/demo?campaign=${campaign.slug}`} target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              Vollbild öffnen
            </a>
          </Button>
        </div>

        <p className="mt-2 text-sm text-gray-600">
          So wird das Widget auf deiner Website aussehen.
        </p>

        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-8">
          <div className="mx-auto max-w-4xl">
            <iframe
              src={`/demo?campaign=${campaign.slug}`}
              className="h-[600px] w-full rounded-lg border-0 bg-white"
              title="Widget Vorschau"
            />
          </div>
        </div>
      </div>

      {/* Widget Einstellungen Link */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Widget anpassen
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Passe das Aussehen und Verhalten des Widgets in den Einstellungen an.
        </p>
        <Button className="mt-4" variant="outline" asChild>
          <a href={`/app/widget?campaign=${campaign.id}`}>
            Zu Widget-Einstellungen
          </a>
        </Button>
      </div>
    </div>
  )
}
