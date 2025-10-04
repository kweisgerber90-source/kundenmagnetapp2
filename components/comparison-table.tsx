// components/comparison-table.tsx
import { Check, X } from 'lucide-react'

type FeatureValue = boolean | string

interface Competitor {
  name: string
  features: Record<string, FeatureValue>
  highlight?: boolean
}

export function ComparisonTable() {
  const competitors: Competitor[] = [
    {
      name: 'Kundenmagnetapp',
      features: {
        'QR-Code Bewertungen': true,
        'Ohne E-Mail Ping-Pong': true,
        'Automatisches Widget': true,
        'DSGVO-konform': true,
        'Server in Deutschland': true,
        'Intelligente Moderation': true,
        'Mobile-optimiert': true,
        'Faire Preise': '9€',
        'Setup-Zeit': '5 Min',
        'Support auf Deutsch': true,
      },
      highlight: true,
    },
    {
      name: 'Trustpilot',
      features: {
        'QR-Code Bewertungen': false,
        'Ohne E-Mail Ping-Pong': false,
        'Automatisches Widget': true,
        'DSGVO-konform': true,
        'Server in Deutschland': false,
        'Intelligente Moderation': true,
        'Mobile-optimiert': true,
        'Faire Preise': '199€',
        'Setup-Zeit': '2-3 Tage',
        'Support auf Deutsch': false,
      },
    },
    {
      name: 'Google Reviews',
      features: {
        'QR-Code Bewertungen': false,
        'Ohne E-Mail Ping-Pong': false,
        'Automatisches Widget': false,
        'DSGVO-konform': '?',
        'Server in Deutschland': false,
        'Intelligente Moderation': false,
        'Mobile-optimiert': true,
        'Faire Preise': 'Kostenlos',
        'Setup-Zeit': '30 Min',
        'Support auf Deutsch': false,
      },
    },
    {
      name: 'Selbstgebaut',
      features: {
        'QR-Code Bewertungen': '?',
        'Ohne E-Mail Ping-Pong': '?',
        'Automatisches Widget': false,
        'DSGVO-konform': '?',
        'Server in Deutschland': '?',
        'Intelligente Moderation': false,
        'Mobile-optimiert': '?',
        'Faire Preise': 'Zeit',
        'Setup-Zeit': 'Wochen',
        'Support auf Deutsch': false,
      },
    },
  ]

  const featureNames = Object.keys(competitors[0].features)

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b p-4 text-left font-semibold">Funktion</th>
            {competitors.map((competitor) => (
              <th
                key={competitor.name}
                className={`border-b p-4 text-center font-semibold ${
                  competitor.highlight ? 'bg-primary/5' : ''
                }`}
              >
                {competitor.name}
                {competitor.highlight && (
                  <div className="mt-1 text-xs font-normal text-primary">Unsere Lösung</div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {featureNames.map((feature) => (
            <tr key={feature} className="border-b">
              <td className="p-4 text-sm font-medium">{feature}</td>
              {competitors.map((competitor) => {
                const featureValue = competitor.features[feature] as FeatureValue
                return (
                  <td
                    key={competitor.name}
                    className={`p-4 text-center ${competitor.highlight ? 'bg-primary/5' : ''}`}
                  >
                    {typeof featureValue === 'boolean' ? (
                      featureValue ? (
                        <Check className="mx-auto h-5 w-5 text-green-500" />
                      ) : (
                        <X className="mx-auto h-5 w-5 text-red-500" />
                      )
                    ) : (
                      <span
                        className={`text-sm ${featureValue === '?' ? 'text-muted-foreground' : ''}`}
                      >
                        {featureValue}
                      </span>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
