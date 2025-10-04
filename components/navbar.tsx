// components/navbar.tsx (updated with better colors)
'use client'

import { Button } from '@/components/ui/button'
import { BRAND } from '@/lib/constants'
import { Menu, QrCode, Shield, Star, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 transition-transform hover:scale-105"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
                <Star className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-xl font-bold text-transparent">
                {BRAND.name}
              </span>
            </Link>

            <div className="ml-10 hidden md:flex md:space-x-8">
              <Link
                href="/features"
                className="flex items-center space-x-1 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
              >
                <span>Funktionen</span>
              </Link>
              <Link
                href="/pricing"
                className="flex items-center space-x-1 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
              >
                <span>Preise</span>
              </Link>
              <Link
                href="/docs"
                className="flex items-center space-x-1 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
              >
                <span>Dokumentation</span>
              </Link>
              <Link
                href="/status"
                className="flex items-center space-x-1 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
              >
                <span>Status</span>
              </Link>
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <div className="flex items-center space-x-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
              <Shield className="h-3.5 w-3.5" />
              <span>DSGVO-konform</span>
            </div>
            <Button variant="ghost" className="hover:bg-gray-100" asChild>
              <Link href="/login">Anmelden</Link>
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
              asChild
            >
              <Link href="/register">
                <QrCode className="mr-2 h-4 w-4" />
                14 Tage testen
              </Link>
            </Button>
          </div>

          <button
            type="button"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menü öffnen"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-100 md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              <Link
                href="/features"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Funktionen
              </Link>
              <Link
                href="/pricing"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Preise
              </Link>
              <Link
                href="/docs"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dokumentation
              </Link>
              <Link
                href="/status"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Status
              </Link>
              <div className="border-t border-gray-100 pt-2">
                <Link
                  href="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Anmelden
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 text-base font-medium text-blue-600 hover:bg-blue-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  14 Tage kostenlos testen
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
