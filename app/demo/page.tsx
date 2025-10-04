// app/demo/page.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BRAND } from '@/lib/constants'
import { CheckCircle, MessageSquare, QrCode, Star } from 'lucide-react'
import Link from 'next/link'

export default function DemoPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="mx-auto mb-16 max-w-4xl text-center">
        <h1 className="mb-4 text-4xl font-bold">Live Demo</h1>
        <p className="text-xl text-muted-foreground">
          Sehen Sie {BRAND.name} in Aktion - interaktive Beispiele und echte Bewertungen
        </p>
      </div>

      {/* QR Code Demo */}
      <section className="mb-16">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold">QR-Code Bewertung</h2>
          <p className="text-muted-foreground">
            So einfach sammeln Ihre Kunden Bewertungen - scannen, bewerten, fertig!
          </p>
        </div>

        <div className="grid items-center gap-8 md:grid-cols-2">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <QrCode className="h-12 w-12 text-primary" />
              </div>
              <CardTitle>QR-Code scannen</CardTitle>
              <CardDescription>Kunden scannen den Code mit ihrem Smartphone</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-lg bg-gray-200">
                <QrCode className="h-16 w-16 text-gray-600" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Beispiel QR-Code für Demo-Restaurant
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="font-medium">Maria S.</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  &quot;Fantastisches Essen und super Service! Das Restaurant ist definitiv einen
                  Besuch wert.&quot;
                </p>
                <p className="mt-2 text-xs text-muted-foreground">vor 2 Stunden</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="font-medium">Thomas M.</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  &quot;Sehr leckere Pizza und freundliches Personal. Gerne wieder!&quot;
                </p>
                <p className="mt-2 text-xs text-muted-foreground">vor 1 Tag</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Widget Demo */}
      <section className="mb-16">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Bewertungs-Widget</h2>
          <p className="text-muted-foreground">So sehen die Bewertungen auf Ihrer Website aus</p>
        </div>

        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Kundenbewertungen
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                4.8 von 5 Sternen (23 Bewertungen)
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                name: 'Sandra K.',
                rating: 5,
                text: 'Hervorragender Service und tolle Atmosphäre!',
              },
              {
                name: 'Michael R.',
                rating: 5,
                text: 'Kann ich nur weiterempfehlen. Top Qualität!',
              },
              { name: 'Anna B.', rating: 4, text: 'Sehr zufrieden, gerne wieder.' },
            ].map((review, index) => (
              <div key={index} className="border-l-2 border-primary/20 pl-4">
                <div className="mb-1 flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${
                          star <= review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{review.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">&quot;{review.text}&quot;</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Features Demo */}
      <section className="mb-16">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Hauptfunktionen</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <QrCode className="mb-2 h-8 w-8 text-primary" />
              <CardTitle className="text-lg">QR-Code Generator</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Automatisch generierte QR-Codes für jeden Standort. Drucken Sie sie aus oder zeigen
                Sie sie digital an.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="mb-2 h-8 w-8 text-primary" />
              <CardTitle className="text-lg">Smart Moderation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Automatische Spam-Erkennung und manuelle Freigabe. Sie behalten die volle Kontrolle
                über Ihre Bewertungen.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Star className="mb-2 h-8 w-8 text-primary" />
              <CardTitle className="text-lg">Responsive Widget</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Passt sich automatisch an jede Website an. Funktioniert auf Desktop, Tablet und
                Smartphone.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold">Überzeugt?</h2>
        <p className="mb-6 text-muted-foreground">
          Starten Sie noch heute und sammeln Sie Ihre ersten Bewertungen in wenigen Minuten.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" asChild>
            <Link href="/register">Jetzt kostenlos testen</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/pricing">Preise ansehen</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
