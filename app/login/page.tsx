// app/login/page.tsx
// Login-Seite (E-Mail/Passwort + Magic Link), DE-Texte, keine UI-Abhängigkeiten.

'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const query = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'password' | 'magic'>('password')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(
    query.get('error') ? 'Anmeldung fehlgeschlagen.' : null,
  )

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    else router.replace('/app')
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) setError(error.message)
    else setMessage('Anmeldelink wurde gesendet. Bitte E-Mail prüfen.')
  }

  return (
    <div className="min-h-[80vh] bg-white">
      <div className="mx-auto max-w-md px-6 py-16">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">Anmelden</h1>
        <p className="mb-6 text-slate-600">
          Melde dich mit E-Mail & Passwort an oder fordere einen Magic Link an.
        </p>

        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setMode('password')}
            className={`rounded-md px-3 py-1 text-sm ${mode === 'password' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Passwort
          </button>
          <button
            onClick={() => setMode('magic')}
            className={`rounded-md px-3 py-1 text-sm ${mode === 'magic' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Magic Link
          </button>
        </div>

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

        {mode === 'password' ? (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
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
              {loading ? 'Anmelden…' : 'Anmelden'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleMagicLink} className="space-y-4">
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
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? 'Senden…' : 'Magic Link senden'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-600">
          Noch kein Konto?{' '}
          <Link
            href="/register"
            className="font-medium text-slate-900 underline-offset-2 hover:underline"
          >
            Jetzt registrieren
          </Link>
        </p>
      </div>
    </div>
  )
}
