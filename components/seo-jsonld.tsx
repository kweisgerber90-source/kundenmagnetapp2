// components/seo-jsonld.tsx
import { BRAND } from '@/lib/constants'

interface SEOJsonLDProps {
  type?: 'Organization' | 'Product' | 'FAQPage'
  data?: Record<string, unknown>
}

export function SEOJsonLD({ type = 'Organization', data = {} }: SEOJsonLDProps) {
  const baseData = {
    '@context': 'https://schema.org',
  }

  let structuredData: Record<string, unknown> = baseData

  switch (type) {
    case 'Organization':
      structuredData = {
        ...baseData,
        '@type': 'Organization',
        name: BRAND.name,
        url: `https://${BRAND.domain}`,
        logo: `https://${BRAND.domain}/logo.png`,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: BRAND.phone,
          contactType: 'customer service',
          areaServed: ['DE', 'AT', 'CH'],
          availableLanguage: 'German',
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: BRAND.address.street,
          addressLocality: BRAND.address.city,
          postalCode: BRAND.address.zip,
          addressCountry: 'DE',
        },
        sameAs: [],
        ...data,
      }
      break

    case 'Product':
      structuredData = {
        ...baseData,
        '@type': 'Product',
        name: BRAND.name,
        description: 'SaaS-Platform für Kundenbewertungen und Testimonials',
        brand: {
          '@type': 'Brand',
          name: BRAND.name,
        },
        offers: [
          {
            '@type': 'Offer',
            name: 'Starter',
            price: '9',
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
          },
          {
            '@type': 'Offer',
            name: 'Pro',
            price: '19',
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
          },
          {
            '@type': 'Offer',
            name: 'Business',
            price: '39',
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
          },
        ],
        ...data,
      }
      break

    case 'FAQPage':
      structuredData = {
        ...baseData,
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Wie funktioniert Kundenmagnetapp?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Erstellen Sie eine Kampagne, teilen Sie den Link oder QR-Code mit Ihren Kunden, sammeln Sie Bewertungen und zeigen Sie diese mit unserem Widget auf Ihrer Website.',
            },
          },
          {
            '@type': 'Question',
            name: 'Ist Kundenmagnetapp DSGVO-konform?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Ja, Kundenmagnetapp ist vollständig DSGVO-konform. Alle Daten werden auf Servern in Deutschland (Frankfurt) gespeichert und wir implementieren alle erforderlichen Datenschutzmaßnahmen.',
            },
          },
          {
            '@type': 'Question',
            name: 'Kann ich Kundenmagnetapp kostenlos testen?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Ja, Sie können Kundenmagnetapp 14 Tage lang kostenlos und unverbindlich testen. Keine Kreditkarte erforderlich.',
            },
          },
        ],
        ...data,
      }
      break
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
