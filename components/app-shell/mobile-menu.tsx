// /components/app-shell/mobile-menu.tsx
// ----------------------------------------------------------------------------
// Mobile Hamburger-Menü (nur < lg sichtbar)
// ----------------------------------------------------------------------------

'use client'

import { BRAND } from '@/lib/constants'
import { mainNavigation } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden">
        <Link href="/app" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <span className="text-lg font-bold text-white">K</span>
          </div>
          {/* 🔧 Korrektur: BRAND.name */}
          <span className="text-lg font-semibold text-gray-900">{BRAND.name}</span>
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
          aria-label="Menü öffnen"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Overlay + Drawer */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setOpen(false)}
          />
          <nav className="fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 border-r border-gray-200 bg-white p-4 lg:hidden">
            <div className="space-y-1">
              {mainNavigation.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100',
                    )}
                  >
                    <Icon className={cn('h-5 w-5', isActive ? 'text-blue-700' : 'text-gray-500')} />
                    <span>{item.title}</span>
                  </Link>
                )
              })}
            </div>
          </nav>
        </>
      )}
    </>
  )
}
