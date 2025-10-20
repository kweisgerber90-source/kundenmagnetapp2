// app/app/layout.tsx
import { getUser } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Protected App Layout
 * Schützt alle /app/* Routes - nur für authentifizierte Benutzer
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hier kommt später die App-Navigation (Sidebar, etc.) */}
      <main>{children}</main>
    </div>
  )
}
