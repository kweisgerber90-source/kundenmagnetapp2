// lib/seo.ts
import { BRAND } from './constants'

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  image?: string
  noindex?: boolean
}

/**
 * Generate canonical URL
 */
export function getCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `https://${BRAND.domain}${cleanPath}`
}

/**
 * Generate Open Graph image URL
 */
export function getOGImageUrl(params?: {
  title?: string
  description?: string
  theme?: 'light' | 'dark'
}): string {
  const baseUrl = `https://${BRAND.domain}/api/og`

  if (!params) return `https://${BRAND.domain}/og-image.png`

  const searchParams = new URLSearchParams()
  if (params.title) searchParams.set('title', params.title)
  if (params.description) searchParams.set('description', params.description)
  if (params.theme) searchParams.set('theme', params.theme)

  return `${baseUrl}?${searchParams.toString()}`
}

/**
 * SEO metadata for common pages
 */
export const SEO_PAGES = {
  home: {
    title: 'Kundenmagnetapp - Kundenbewertungen einfach sammeln',
    description:
      'Die einfachste Lösung für authentische Kundenbewertungen. QR-Codes, automatische Moderation und Widget. DSGVO-konform mit Servern in Deutschland.',
    keywords: [
      'Kundenbewertungen',
      'Testimonials',
      'QR-Code Bewertungen',
      'DSGVO-konform',
      'Made in Germany',
    ],
  },
  features: {
    title: 'Funktionen',
    description:
      'Alle Funktionen von Kundenmagnetapp: QR-Codes, Moderation, Widget, Analytics und mehr. Perfekt für Unternehmen in DACH.',
    keywords: ['QR-Code', 'Moderation', 'Widget', 'Analytics', 'Integration'],
  },
  pricing: {
    title: 'Preise',
    description:
      'Transparente Preise für jeden Bedarf. Starter ab 9€, Pro 19€, Business 39€. Alle Preise zzgl. 19% MwSt. 14 Tage kostenlos testen.',
    keywords: ['Preise', 'Tarife', 'Abonnement', 'B2B', 'MwSt'],
  },
  docs: {
    title: 'Dokumentation',
    description:
      'Komplette Dokumentation für Kundenmagnetapp. Installation, Widget-Integration, API-Referenz und Best Practices.',
    keywords: ['Dokumentation', 'Installation', 'Widget', 'API', 'Tutorial'],
  },
  contact: {
    title: 'Kontakt',
    description:
      'Kontaktieren Sie uns bei Fragen zu Kundenmagnetapp. E-Mail, Kontaktformular und Support-Optionen.',
    keywords: ['Kontakt', 'Support', 'Hilfe', 'E-Mail'],
  },
} as const

/**
 * Generate structured data (JSON-LD) for rich snippets
 */
export function generateStructuredData(type: 'Organization' | 'SoftwareApplication' | 'FAQ') {
  const baseData = {
    '@context': 'https://schema.org',
  }

  switch (type) {
    case 'Organization':
      return {
        ...baseData,
        '@type': 'Organization',
        name: BRAND.name,
        url: `https://${BRAND.domain}`,
        logo: `https://${BRAND.domain}/logo.png`,
        description: SEO_PAGES.home.description,
        address: {
          '@type': 'PostalAddress',
          streetAddress: BRAND.address.street,
          addressLocality: BRAND.address.city,
          postalCode: BRAND.address.zip,
          addressCountry: 'DE',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          email: BRAND.email.support,
          contactType: 'customer support',
          areaServed: ['DE', 'AT', 'CH'],
          availableLanguage: ['German'],
        },
      }

    case 'SoftwareApplication':
      return {
        ...baseData,
        '@type': 'SoftwareApplication',
        name: BRAND.name,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: Object.entries(BRAND.plans).map(([_key, plan]) => ({
          '@type': 'Offer',
          name: plan.name,
          price: plan.price,
          priceCurrency: 'EUR',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: plan.price,
            priceCurrency: 'EUR',
            valueAddedTaxIncluded: false,
          },
        })),
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '127',
          bestRating: '5',
          worstRating: '1',
        },
      }

    case 'FAQ':
      return {
        ...baseData,
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Wie funktioniert Kundenmagnetapp?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Erstellen Sie eine Kampagne, teilen Sie den QR-Code oder Link mit Ihren Kunden, sammeln Sie Bewertungen und zeigen Sie diese automatisch mit unserem Widget auf Ihrer Website.',
            },
          },
          {
            '@type': 'Question',
            name: 'Ist Kundenmagnetapp DSGVO-konform?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Ja, vollständig DSGVO-konform. Alle Daten werden auf Servern in Deutschland (Frankfurt) gespeichert.',
            },
          },
          {
            '@type': 'Question',
            name: 'Kann ich kostenlos testen?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Ja, alle Pläne können 14 Tage kostenlos getestet werden. Keine Kreditkarte erforderlich.',
            },
          },
        ],
      }
  }
}
