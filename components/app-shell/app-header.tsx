// /components/app-shell/app-header.tsx
// ----------------------------------------------------------------------------
// Header — kleiner Fix für Typed Routes im Link zur Einstellungsseite
// ----------------------------------------------------------------------------

'use client'

import { LogOut, Settings, User } from 'lucide-react'
import type { Route } from 'next' // 🔧
import Link from 'next/link'
import { useState } from 'react'

interface AppHeaderProps {
  user: {
    email: string
    name?: string
  }
}

export function AppHeader({ user }: AppHeaderProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-end border-b border-gray-200 bg-white px-6">
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <User className="h-4 w-4" />
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-gray-900">
              {user.name || user.email.split('@')[0]}
            </div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
              <div className="p-2">
                <Link
                  href={'/app/einstellungen' as Route} // 🔧 Cast für Typed Routes
                  className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  <Settings className="h-4 w-4 text-gray-500" />
                  <span>Einstellungen</span>
                </Link>

                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="flex w-full items-center space-x-3 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 text-gray-500" />
                    <span>Abmelden</span>
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
