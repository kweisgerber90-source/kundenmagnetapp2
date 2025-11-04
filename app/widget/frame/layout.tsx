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
      <body className={`${inter.className} h-full bg-transparent`}>
        {/* Nur der Widget-Content, keine Navigation oder Footer */}
        {children}
      </body>
    </html>
  )
}
