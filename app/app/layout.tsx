// app/app/layout.tsx
// Geschütztes App-Layout (prüft Auth serverseitig)

import { getUser } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App-Navigation folgt in Schritt 3A */}
      <main className="mx-auto max-w-5xl p-6">{children}</main>
    </div>
  )
}
