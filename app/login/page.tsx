'use client'

// Anmeldeseite (E-Mail/Passwort + Magic Link) im einheitlichen UI-Stil.

import { AlertError, AlertSuccess } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
    <div className="min-h-[80vh] bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-md px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Anmelden</CardTitle>
            <CardDescription>
              Melde dich mit E-Mail & Passwort an oder fordere einen Magic Link an.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-2">
              <Button
                variant={mode === 'password' ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setMode('password')}
              >
                Passwort
              </Button>
              <Button
                variant={mode === 'magic' ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setMode('magic')}
              >
                Magic Link
              </Button>
            </div>

            {error && <AlertError>{error}</AlertError>}
            {message && <AlertSuccess>{message}</AlertSuccess>}

            {mode === 'password' ? (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">E-Mail</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@firma.de"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Passwort</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Anmelden…' : 'Anmelden'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleMagicLink} className="space-y-4">
                <div>
                  <Label htmlFor="email2">E-Mail</Label>
                  <Input
                    id="email2"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@firma.de"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Senden…' : 'Magic Link senden'}
                </Button>
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
