// app/layout.tsx
import '@/app/globals.css'
import { CookieBanner } from '@/components/cookie-banner'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { SEOJsonLD } from '@/components/seo-jsonld'
import { CookieConsentProvider } from '@/hooks/use-cookie-consent'
import { earlyBlockerScript } from '@/lib/cookie-consent'
import { DEFAULT_METADATA } from '@/lib/metadata'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = DEFAULT_METADATA

// Viewport für mobiles Rendering (Next 14 App Router)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        {/* Früher Cookie-Blocker im <head> */}
        <script dangerouslySetInnerHTML={{ __html: earlyBlockerScript() }} />
        {/* Fallback: meta viewport (optional, da oben viewport exportiert ist) */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <SEOJsonLD type="Organization" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* <link rel="manifest" href="/manifest.json" /> */}
        <meta name="theme-color" content="#0f172a" />
      </head>
      {/* overflow-x-clip verhindert horizontales Scrollen durch dekorative Absolut-Elemente */}
      <body className={`${inter.className} overflow-x-clip`}>
        <CookieConsentProvider>
          <div className="flex min-h-screen flex-col overflow-x-clip">
            <Navbar />
            <main className="flex-1 overflow-x-clip">{children}</main>
            <Footer />
          </div>
          <CookieBanner />
        </CookieConsentProvider>
      </body>
    </html>
  )
}
