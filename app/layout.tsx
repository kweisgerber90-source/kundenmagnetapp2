// app/layout.tsx
import '@/app/globals.css'
import { CookieBanner } from '@/components/cookie-banner'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { SEOJsonLD } from '@/components/seo-jsonld'
import { CookieConsentProvider } from '@/hooks/use-cookie-consent'
import { earlyBlockerScript } from '@/lib/cookie-consent' // ⬅️ добавлено
import { DEFAULT_METADATA } from '@/lib/metadata'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = DEFAULT_METADATA

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        {/* РАННИЙ БЛОКИРОВЩИК ДОЛЖЕН ИДТИ В <head> */}
        <script dangerouslySetInnerHTML={{ __html: earlyBlockerScript() }} />

        <SEOJsonLD type="Organization" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* <link rel="manifest" href="/manifest.json" /> */}
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className={inter.className}>
        <CookieConsentProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CookieBanner />
        </CookieConsentProvider>
      </body>
    </html>
  )
}
