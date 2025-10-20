// app/register/page.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BRAND } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useState } from 'react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validierung
    if (password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein')
      setLoading(false)
      return
    }

    // Registrierung bei Supabase
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/app`,
        data: {
          full_name: fullName || null,
          company_name: companyName || null,
        },
      },
    })

    if (signUpError) {
      setError(
        signUpError.message === 'User already registered'
          ? 'Diese E-Mail-Adresse ist bereits registriert'
          : signUpError.message,
      )
      setLoading(false)
      return
    }

    // Erfolg - Bestätigungs-E-Mail wurde gesendet
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Bestätigen Sie Ihre E-Mail</CardTitle>
              <CardDescription>Fast geschafft!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
                <p className="font-medium">Registrierung erfolgreich!</p>
                <p className="mt-2">
                  Wir haben Ihnen eine E-Mail an <strong>{email}</strong> gesendet.
                </p>
                <p className="mt-1">
                  Bitte klicken Sie auf den Link in der E-Mail, um Ihr Konto zu aktivieren.
                </p>
              </div>
              <div className="text-center">
                <Link href="/login" className="text-sm underline hover:no-underline">
                  Zurück zum Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Kostenlosen Test starten</CardTitle>
            <CardDescription>
              Testen Sie {BRAND.name} 14 Tage kostenlos. Keine Kreditkarte erforderlich.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail-Adresse *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ihre@email.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Ihr Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Max Mustermann"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Unternehmen</Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Ihr Unternehmen"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Passwort * (min. 6 Zeichen)</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? 'Wird registriert...' : 'Kostenlosen Test starten'}
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground">
              Mit der Registrierung stimmen Sie unseren{' '}
              <Link href="/legal/agb" className="underline hover:no-underline">
                AGB
              </Link>{' '}
              und der{' '}
              <Link href="/legal/datenschutz" className="underline hover:no-underline">
                Datenschutzerklärung
              </Link>{' '}
              zu.
            </p>

            <div className="text-center text-sm">
              <Link href="/login" className="underline hover:no-underline">
                Bereits ein Konto? Jetzt anmelden
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
