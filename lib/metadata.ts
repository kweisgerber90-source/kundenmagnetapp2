// lib/metadata.ts
import { BRAND } from '@/lib/constants'
import { Metadata } from 'next'

export const DEFAULT_METADATA: Metadata = {
  title: {
    template: `%s | ${BRAND.name}`,
    default: `${BRAND.name} - Kundenbewertungen einfach sammeln und anzeigen`,
  },
  description:
    'Die einfachste Lösung für authentische Kundenbewertungen. Sammeln Sie Testimonials per QR-Code, moderieren Sie mit einem Klick und binden Sie das Widget überall ein. DSGVO-konform mit Servern in Deutschland.',
  keywords: [
    'Kundenbewertungen',
    'Testimonials',
    'Bewertungsmanagement',
    'QR-Code Bewertungen',
    'Widget',
    'DSGVO-konform',
    'Made in Germany',
    'Kundenfeedback',
    'Online-Bewertungen',
    'Rezensionen sammeln',
  ],
  authors: [{ name: BRAND.owner }],
  creator: BRAND.owner,
  publisher: BRAND.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(`https://${BRAND.domain}`),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${BRAND.name} - Kundenbewertungen einfach sammeln`,
    description:
      'Sammeln und zeigen Sie authentische Kundenbewertungen. Mit QR-Codes, automatischer Moderation und einem Widget das überall funktioniert.',
    url: `https://${BRAND.domain}`,
    siteName: BRAND.name,
    locale: 'de_DE',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${BRAND.name} - Kundenbewertungen Platform`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND.name} - Kundenbewertungen einfach sammeln`,
    description: 'Die einfachste Lösung für authentische Kundenbewertungen in DACH.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification_token_here',
    yandex: 'verification_token_here',
  },
}

export function generatePageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${title} | ${BRAND.name}`,
      description,
      url: `https://${BRAND.domain}${path}`,
    },
  }
}
