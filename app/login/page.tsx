// app/login/page.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BRAND } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const supabase = createClient()

  // Fehler aus URL-Params anzeigen
  const urlError = searchParams.get('error')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? 'Ungültige E-Mail oder Passwort'
          : error.message,
      )
      setLoading(false)
    } else {
      router.push('/app' as never)
      router.refresh()
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/app`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setMagicLinkSent(true)
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Anmelden</CardTitle>
            <CardDescription>Melden Sie sich in Ihrem {BRAND.name} Konto an.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {urlError && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                {urlError === 'auth_failed' && 'Authentifizierung fehlgeschlagen'}
                {urlError === 'confirmation_failed' && 'E-Mail-Bestätigung fehlgeschlagen'}
              </div>
            )}

            {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>}

            {magicLinkSent ? (
              <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
                <p className="font-medium">Magic Link versendet!</p>
                <p className="mt-1">
                  Bitte überprüfen Sie Ihre E-Mails ({email}) und klicken Sie auf den Link zum
                  Anmelden.
                </p>
              </div>
            ) : (
              <>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail-Adresse</Label>
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
                    <Label htmlFor="password">Passwort</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? 'Wird angemeldet...' : 'Anmelden'}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Oder</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleMagicLink}
                  disabled={loading || !email}
                >
                  Magic Link per E-Mail senden
                </Button>
              </>
            )}

            <div className="text-center text-sm">
              <Link href="/register" className="underline hover:no-underline">
                Noch kein Konto? Jetzt registrieren
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
