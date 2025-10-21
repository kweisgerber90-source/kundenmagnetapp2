// app/register/page.tsx
// Registrierungsseite (E-Mail/Passwort). Nach Registrierung: E-Mail bestätigen.

'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useState } from 'react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { company },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)
    if (error) setError(error.message)
    else setMessage('Bitte bestätige deine E-Mail. Prüfe deinen Posteingang.')
  }

  return (
    <div className="min-h-[80vh] bg-white">
      <div className="mx-auto max-w-md px-6 py-16">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">Registrieren</h1>
        <p className="mb-6 text-slate-600">
          Erstelle dein Konto, um Kundenstimmen zu sammeln und zu zeigen.
        </p>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {message}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm text-slate-700">Firma (optional)</span>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="Meine Agentur GmbH"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-slate-700">E-Mail</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="name@firma.de"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-slate-700">Passwort</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? 'Registrieren…' : 'Registrieren'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Bereits ein Konto?{' '}
          <Link
            href="/login"
            className="font-medium text-slate-900 underline-offset-2 hover:underline"
          >
            Jetzt anmelden
          </Link>
        </p>
      </div>
    </div>
  )
}
