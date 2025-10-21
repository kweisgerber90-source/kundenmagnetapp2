// app/app/page.tsx
// Einfaches Dashboard-Placeholder ohne UI-Abhängigkeiten.

import { getUser } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const user = await getUser()
  if (!user) redirect('/login')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Willkommen 👋</h1>
      <p className="text-slate-600">
        Angemeldet als <span className="font-medium">{user.email}</span>.
      </p>

      <form action="/auth/signout" method="post" className="pt-2">
        <button
          type="submit"
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
        >
          Abmelden
        </button>
      </form>
    </div>
  )
}
