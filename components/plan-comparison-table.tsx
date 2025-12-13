// /components/plan-comparison-table.tsx
/**
 * 📊 Feature-Vergleichstabelle für Pricing-Pläne
 * Zeigt alle Features systematisch mit Check-Marks oder Werten
 */

import { PLANS, PLAN_LIMITS, PLAN_ORDER } from '@/lib/stripe/plans'
import type { PlanId } from '@/lib/types/billing'
import { Check, Infinity, X } from 'lucide-react'
import { Fragment } from 'react'

interface FeatureRow {
  category?: string
  name: string
  tooltip?: string
  getValue: (planId: PlanId) => string | number | boolean
}

export function PlanComparisonTable() {
  const featureRows: FeatureRow[] = [
    // Kampagnen & Testimonials
    {
      category: 'Kampagnen & Bewertungen',
      name: 'Anzahl Kampagnen',
      tooltip: 'Wie viele separate Bewertungskampagnen Sie parallel betreiben können',
      getValue: (planId) => {
        const limit = PLAN_LIMITS[planId as keyof typeof PLAN_LIMITS].max_campaigns
        return limit >= 9999 ? 'Unbegrenzt' : limit.toString()
      },
    },
    {
      name: 'Testimonials pro Kampagne',
      tooltip: 'Maximale Anzahl an Kundenbewertungen pro Kampagne',
      getValue: (planId) => {
        const limit = PLAN_LIMITS[planId as keyof typeof PLAN_LIMITS].max_testimonials_per_campaign
        return limit >= 9999 ? 'Unbegrenzt' : limit.toString()
      },
    },

    // QR-Codes
    {
      category: 'QR-Code Funktionen',
      name: 'Anzahl QR-Codes',
      tooltip: 'Wie viele QR-Codes Sie erstellen können',
      getValue: (planId) => PLAN_LIMITS[planId as keyof typeof PLAN_LIMITS].max_qr_codes.toString(),
    },
    {
      name: 'QR-Scans pro Tag',
      tooltip: 'Maximale Anzahl der Scans Ihrer QR-Codes pro Tag',
      getValue: (planId) => {
        const limit = PLAN_LIMITS[planId as keyof typeof PLAN_LIMITS].max_qr_scans_per_day
        return limit.toLocaleString('de-DE')
      },
    },

    // Widget
    {
      category: 'Widget & Integration',
      name: 'Widget-Anfragen pro Tag',
      tooltip: 'Wie oft das Widget pro Tag aufgerufen werden kann',
      getValue: (planId) => {
        const limit = PLAN_LIMITS[planId as keyof typeof PLAN_LIMITS].max_widget_requests_per_day
        return limit.toLocaleString('de-DE')
      },
    },
    {
      name: 'Erweiterte Widget-Anpassung',
      tooltip: 'Farben, Themes, Layout nach Ihren Wünschen anpassen',
      getValue: (planId) => PLAN_LIMITS[planId as keyof typeof PLAN_LIMITS].can_customize_widget,
    },
    {
      name: 'White-Label Widget',
      tooltip: 'Kundenmagnetapp Branding entfernen',
      getValue: (planId) => PLAN_LIMITS[planId as keyof typeof PLAN_LIMITS].can_white_label,
    },

    // Export & API
    {
      category: 'Export & API',
      name: 'CSV-Export',
      tooltip: 'Testimonials als CSV herunterladen',
      getValue: (planId) => PLAN_LIMITS[planId as keyof typeof PLAN_LIMITS].can_export_csv,
    },
    {
      name: 'API-Zugang',
      tooltip: 'Programmatischer Zugriff auf Ihre Daten',
      getValue: (planId) => PLAN_LIMITS[planId as keyof typeof PLAN_LIMITS].can_use_api,
    },

    // Support
    {
      category: 'Support',
      name: 'E-Mail Support',
      getValue: () => true,
    },
    {
      name: 'Priority Support & Onboarding',
      tooltip: 'Schnellere Antwortzeiten und persönliches Onboarding',
      getValue: (planId) => PLAN_LIMITS[planId as keyof typeof PLAN_LIMITS].has_priority_support,
    },
  ]

  const renderValue = (value: string | number | boolean, _planId: PlanId) => {
    // Boolean Werte
    if (typeof value === 'boolean') {
      if (value) {
        return <Check className="mx-auto h-5 w-5 text-green-600" />
      }
      return <X className="mx-auto h-5 w-5 text-gray-300" />
    }

    // String/Number Werte
    if (value === 'Unbegrenzt') {
      return (
        <div className="flex items-center justify-center gap-1 text-sm font-semibold text-blue-600">
          <Infinity className="h-4 w-4" />
          <span>Unbegrenzt</span>
        </div>
      )
    }

    return <span className="text-sm font-medium text-gray-900">{value}</span>
  }

  let currentCategory = ''

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead>
            <tr className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Features</th>
              {PLAN_ORDER.map((planId) => {
                const plan = PLANS[planId]
                const isHighlighted = plan.highlighted
                return (
                  <th
                    key={planId}
                    className={`px-6 py-4 text-center ${isHighlighted ? 'bg-blue-600 text-white' : 'text-gray-900'}`}
                  >
                    <div className="text-lg font-bold">{plan.nameDE}</div>
                    <div
                      className={`mt-1 text-xs font-normal ${isHighlighted ? 'text-blue-100' : 'text-gray-500'}`}
                    >
                      {plan.priceMonthly}€ / Monat
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {featureRows.map((row, index) => {
              // Kategorie-Überschrift
              const showCategory = row.category && row.category !== currentCategory
              if (showCategory) {
                currentCategory = row.category || ''
              }

              return (
                // 🔧 Korrektur: Fragment mit Key, um React/ESLint-Warnungen zu vermeiden
                <Fragment key={`feature-row-${index}`}>
                  {showCategory && (
                    <tr className="bg-gray-50">
                      {/* 🔧 Korrektur: colSpan dynamisch, falls sich die Plan-Anzahl ändert */}
                      <td
                        colSpan={PLAN_ORDER.length + 1}
                        className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700"
                      >
                        {row.category}
                      </td>
                    </tr>
                  )}

                  <tr className="border-b border-gray-100 transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{row.name}</div>
                      {row.tooltip && (
                        <div className="mt-0.5 text-xs text-gray-500">{row.tooltip}</div>
                      )}
                    </td>

                    {PLAN_ORDER.map((planId) => {
                      const plan = PLANS[planId]
                      const value = row.getValue(planId)
                      return (
                        <td
                          key={planId}
                          className={`px-6 py-4 text-center ${plan.highlighted ? 'bg-blue-50/30' : ''}`}
                        >
                          {renderValue(value, planId)}
                        </td>
                      )
                    })}
                  </tr>
                </Fragment>
              )
            })}
          </tbody>

          {/* Footer mit CTA */}
          <tfoot>
            <tr className="border-t-2 border-gray-200 bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-700">Jetzt starten</td>
              {PLAN_ORDER.map((planId) => {
                const plan = PLANS[planId]
                return (
                  <td key={planId} className="px-6 py-4 text-center">
                    <a
                      href={`/register?plan=${planId}`}
                      className={`inline-flex items-center justify-center rounded-lg px-6 py-2.5 text-sm font-semibold transition-all ${
                        plan.highlighted
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg'
                          : 'border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      14 Tage testen
                    </a>
                  </td>
                )
              })}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Mobile Hinweis */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 md:hidden">
        <p className="text-xs text-gray-600">
          💡 Tipp: Scrollen Sie horizontal, um alle Features zu sehen
        </p>
      </div>
    </div>
  )
}
