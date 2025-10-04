import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
} from '@/components/ui'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontakt | Kundenmagnet App',
  description:
    'Nehmen Sie Kontakt mit uns auf. Wir helfen Ihnen gerne bei Fragen zur Kundenmagnet App.',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">Kontakt aufnehmen</h1>
        <p className="text-lg text-gray-600">
          Haben Sie Fragen oder benötigen Sie Unterstützung? Wir sind für Sie da!
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nachricht senden</CardTitle>
          <CardDescription>
            Füllen Sie das Formular aus und wir melden uns schnellstmöglich bei Ihnen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Vorname *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  placeholder="Ihr Vorname"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nachname *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  placeholder="Ihr Nachname"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-Mail-Adresse *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="ihre.email@beispiel.de"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Unternehmen</Label>
              <Input
                id="company"
                name="company"
                type="text"
                placeholder="Ihr Unternehmen (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Betreff *</Label>
              <Input
                id="subject"
                name="subject"
                type="text"
                required
                placeholder="Worum geht es?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Nachricht *</Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={6}
                placeholder="Beschreiben Sie Ihr Anliegen..."
              />
            </div>

            <Button type="submit" className="w-full">
              Nachricht senden
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 grid grid-cols-1 gap-6 text-center md:grid-cols-3">
        <div className="p-4">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900">E-Mail</h3>
          <p className="text-sm text-gray-600">support@kundenmagnet.app</p>
        </div>

        <div className="p-4">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900">Telefon</h3>
          <p className="text-sm text-gray-600">+49 (0) 123 456 789</p>
        </div>

        <div className="p-4">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <svg
              className="h-6 w-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900">Support-Zeiten</h3>
          <p className="text-sm text-gray-600">Mo-Fr: 9:00-18:00</p>
        </div>
      </div>
    </div>
  )
}
