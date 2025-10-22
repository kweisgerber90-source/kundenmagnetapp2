// /components/app-shell/app-sidebar.tsx
// ----------------------------------------------------------------------------
// Sidebar-Navigation für die App (Desktop)
// ----------------------------------------------------------------------------

'use client'

import { BRAND } from '@/lib/constants'
import { mainNavigation } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white">
      {/* Kopf mit Logo/Name */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <Link href="/app" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <span className="text-lg font-bold text-white">K</span>
          </div>
          {/* 🔧 Korrektur: BRAND.name statt nicht vorhandenes BRAND.productName */}
          <span className="text-lg font-semibold text-gray-900">{BRAND.name}</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 p-4">
        {mainNavigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
              )}
            >
              <Icon className={cn('h-5 w-5', isActive ? 'text-blue-700' : 'text-gray-500')} />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer-Links (rechtlich) */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4">
        <div className="text-xs text-gray-500">
          <div className="font-medium">v0.1.0</div>
          <div className="mt-1">
            <Link href="/legal/datenschutz" className="hover:text-gray-700">
              Datenschutz
            </Link>
            {' · '}
            <Link href="/legal/impressum" className="hover:text-gray-700">
              Impressum
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}
