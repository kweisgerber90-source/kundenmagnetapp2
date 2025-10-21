'use client'

// Registrierungsseite (E-Mail/Passwort) im einheitlichen UI-Stil.
// Nach Registrierung: E-Mail bestätigen via /auth/confirm.

import { AlertError, AlertSuccess } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    })

    setLoading(false)
    if (error) {
      const msg = error.message?.toLowerCase() ?? ''
      if (msg.includes('rate limit')) {
        setError(
          'Zu viele Bestätigungs-E-Mails in kurzer Zeit. Bitte warte 1 Minute und versuche es erneut.',
        )
      } else {
        setError(error.message)
      }
      return
    }
    setMessage('Bitte bestätige deine E-Mail. Prüfe deinen Posteingang.')
  }

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-md px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Registrieren</CardTitle>
            <CardDescription>
              Erstelle dein Konto, um Kundenstimmen zu sammeln und zu zeigen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && <AlertError>{error}</AlertError>}
            {message && <AlertSuccess>{message}</AlertSuccess>}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="company">Firma (optional)</Label>
                <Input
                  id="company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Meine Agentur GmbH"
                />
              </div>
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
                {loading ? 'Registrieren…' : 'Registrieren'}
              </Button>
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
