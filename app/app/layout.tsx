// /app/app/layout.tsx
// ----------------------------------------------------------------------------
// Geschütztes App-Layout mit Sidebar (serverseitige Auth-Prüfung)
// ----------------------------------------------------------------------------

import { AppHeader } from '@/components/app-shell/app-header'
import { AppSidebar } from '@/components/app-shell/app-sidebar'
import { MobileMenu } from '@/components/app-shell/mobile-menu'
import { LimitDialogProvider } from '@/components/billing/limit-reached-dialog' // 🔧 Korrektur: Provider global einbinden
import { UpgradeBanner } from '@/components/billing/upgrade-banner'
import { getUser } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { Toaster } from 'sonner' // 🔔 Toasts einbinden

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔔 Toaster für Benachrichtigungen */}
      <Toaster position="top-right" richColors />

      {/* Desktop: permanente Sidebar */}
      <div className="hidden lg:block">
        <AppSidebar />
      </div>

      {/* Mobile: Topbar + Drawer */}
      <MobileMenu />

      {/* Inhalt rechts der Sidebar */}
      <div className="lg:pl-64">
        {/* 🔒 Header zeigt angemeldeten Benutzer */}
        <AppHeader user={{ email: user.email || '', name: user.user_metadata?.name }} />

        {/* 🔧 Korrektur: Limit-Dialog & Upgrade-Hinweise global für alle App-Seiten */}
        <LimitDialogProvider>
          <main className="p-6">
            <div className="mb-4">
              <UpgradeBanner />
            </div>
            {children}
          </main>
        </LimitDialogProvider>
      </div>
    </div>
  )
}
