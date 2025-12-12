// /app/app/admin/layout.tsx
/**
 * 🔐 Admin Layout
 * Schützt alle Admin-Routen
 */

import { checkAdmin } from '@/lib/auth/admin'
import { AlertTriangle, Shield } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin } = await checkAdmin()

  if (!isAdmin) {
    redirect('/app')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="border-b bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6" />
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-sm text-purple-100">Eingeschränkter Zugriff</p>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="border-b bg-yellow-50">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-yellow-800">
            <AlertTriangle className="h-4 w-4" />
            <span>
              Admin-Bereich: Alle Aktionen werden protokolliert. Zugriff nur für autorisierte User.
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl">{children}</div>
    </div>
  )
}
