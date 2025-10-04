// app/login/page.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BRAND } from '@/lib/constants'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Anmelden</CardTitle>
            <CardDescription>Melden Sie sich in Ihrem {BRAND.name} Konto an.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  E-Mail-Adresse
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="ihre@email.de"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Passwort
                </label>
                <input
                  id="password"
                  type="password"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>
            </div>
            <Button className="w-full" type="submit">
              Anmelden
            </Button>
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
