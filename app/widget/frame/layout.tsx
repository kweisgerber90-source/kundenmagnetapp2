// /app/widget/frame/layout.tsx
// Minimales Layout OHNE Navbar, Footer, Cookie-Banner für Widget-Embedding

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kundenmagnet Widget',
  robots: 'noindex, nofollow', // Widget-iFrame soll nicht indexiert werden
}

export default function WidgetFrameLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="h-full">
      <head>
        {/* Cookie-Banner ausblenden wenn im iFrame */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Verstecke Cookie-Banner im Widget-iFrame */
              [class*="cookie"],
              [id*="cookie"],
              [class*="consent"],
              [id*="consent"],
              .borlabs-cookie-box,
              #cookie-law-info-bar,
              .cookie-notice,
              .gdpr-cookie-notice {
                display: none !important;
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} h-full bg-transparent`}>
        {/* Nur der Widget-Content, keine Navigation oder Footer */}
        {children}
      </body>
    </html>
  )
}
