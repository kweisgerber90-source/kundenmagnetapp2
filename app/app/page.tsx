// app/app/page.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getUser } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Dashboard (Placeholder für Schritt 3A)
 */
export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Willkommen im Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Angemeldet als: <strong>{user.email}</strong>
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Kampagnen</CardTitle>
            <CardDescription>Verwalten Sie Ihre Bewertungskampagnen</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Hier können Sie bald Kampagnen erstellen und verwalten.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Testimonials</CardTitle>
            <CardDescription>Moderieren Sie Kundenbewertungen</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Hier können Sie bald Bewertungen freigeben und moderieren.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Widget</CardTitle>
            <CardDescription>Betten Sie Bewertungen ein</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Hier erhalten Sie bald den Einbettungscode für Ihre Website.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <form action="/auth/signout" method="post">
          <Button variant="outline" type="submit">
            Abmelden
          </Button>
        </form>
      </div>
    </div>
  )
}
