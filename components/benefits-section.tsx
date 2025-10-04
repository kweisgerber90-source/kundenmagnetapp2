// components/benefits-section.tsx
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Clock,
  Globe,
  Mail,
  MessageSquare,
  QrCode,
  Shield,
  Smartphone,
  Sparkles,
  Users,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'

export function BenefitsSection() {
  const mainBenefits = [
    {
      icon: 'mail',
      title: 'Ohne E-Mail Ping-Pong',
      description: 'Schluss mit endlosen E-Mail-Ketten. Ihre Kunden bewerten direkt - ohne Umwege.',
      highlight: true,
      details: [
        'Keine nervigen Follow-up E-Mails nötig',
        'Direkter Link oder QR-Code zum Bewerten',
        'Höhere Antwortrate durch Einfachheit',
      ],
    },
    {
      icon: 'qrcode',
      title: 'QR-Code Sammlung',
      description: 'Perfekt für vor Ort. Kunden scannen, bewerten, fertig - in unter 30 Sekunden.',
      highlight: true,
      details: [
        'Druckfertige QR-Codes in Sekunden',
        'Tracking wer, wann und wo gescannt hat',
        'Ideal für Restaurants, Läden und Events',
      ],
    },
    {
      icon: 'shield',
      title: 'Intelligente Moderation',
      description:
        'Behalten Sie die volle Kontrolle. Spam wird gefiltert, echtes Feedback kommt durch.',
      highlight: true,
      details: [
        'Automatische Spam-Erkennung',
        'Manuelle Freigabe mit einem Klick',
        'Benachrichtigung bei neuen Bewertungen',
      ],
    },
    {
      icon: 'sparkles',
      title: 'Automatisches Widget',
      description: 'Einmal eingebunden, immer aktuell. Neue Bewertungen erscheinen automatisch.',
      highlight: true,
      details: [
        'Echtzeit-Updates ohne manuellen Aufwand',
        'Responsive für alle Bildschirmgrößen',
        'SEO-optimiert für bessere Rankings',
      ],
    },
  ]

  const additionalBenefits = [
    {
      icon: 'clock',
      title: '5 Minuten Setup',
      description: 'Von der Registrierung bis zur ersten Bewertung in weniger als 5 Minuten.',
    },
    {
      icon: 'smartphone',
      title: 'Mobile-First',
      description: 'Optimiert für Smartphones. 85% Ihrer Kunden bewerten mobil.',
    },
    {
      icon: 'globe',
      title: 'Überall einsetzbar',
      description: 'WordPress, Shopify, Wix oder pure HTML - funktioniert überall.',
    },
    {
      icon: 'chart',
      title: 'Aussagekräftige Analytics',
      description: 'Verstehen Sie Ihre Kunden besser mit detaillierten Auswertungen.',
    },
  ]

  // Icon mapping function to get the actual component
  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      mail: Mail,
      qrcode: QrCode,
      shield: Shield,
      sparkles: Sparkles,
      clock: Clock,
      smartphone: Smartphone,
      globe: Globe,
      chart: BarChart3,
    }
    return iconMap[iconName] || Mail
  }

  return (
    <section className="py-16">
      {/* Hauptvorteile mit Details */}
      <div className="mb-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Warum Kundenmagnetapp anders ist</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Wir haben die nervigsten Probleme beim Sammeln von Kundenbewertungen gelöst. Endlich ein
            Tool, das für Sie und Ihre Kunden funktioniert.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {mainBenefits.map((benefit, index) => (
            <div
              key={index}
              className={`group relative rounded-xl border bg-card p-6 transition-all hover:shadow-lg ${
                benefit.highlight ? 'border-primary/50' : ''
              }`}
            >
              {benefit.highlight && (
                <div className="absolute -top-3 left-6">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Highlight
                  </span>
                </div>
              )}

              <div className="mb-4 flex items-start space-x-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  {(() => {
                    const IconComponent = getIcon(benefit.icon)
                    return <IconComponent className="h-6 w-6 text-primary" />
                  })()}
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-xl font-semibold">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>

              {benefit.details && (
                <ul className="ml-16 space-y-2">
                  {benefit.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start text-sm text-muted-foreground">
                      <CheckCircle className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Problem/Solution Vergleich */}
      <div className="mb-16 rounded-xl bg-muted/50 p-8">
        <h3 className="mb-6 text-center text-2xl font-bold">
          Der alte Weg vs. Der Kundenmagnet-Weg
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="text-center">
              <div className="mb-2 text-lg font-semibold text-destructive">❌ Der alte Weg</div>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start">
                <XCircle className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                <span className="text-sm">
                  E-Mail an Kunden → Keine Antwort → Nachhaken → Genervte Kunden
                </span>
              </li>
              <li className="flex items-start">
                <XCircle className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                <span className="text-sm">Komplizierte Formulare die keiner ausfüllt</span>
              </li>
              <li className="flex items-start">
                <XCircle className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                <span className="text-sm">
                  Manuelles Copy-Paste von Bewertungen auf die Website
                </span>
              </li>
              <li className="flex items-start">
                <XCircle className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                <span className="text-sm">Spam und Fake-Bewertungen durchsieben</span>
              </li>
              <li className="flex items-start">
                <XCircle className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                <span className="text-sm">Veraltete Testimonials, die niemand aktualisiert</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <div className="mb-2 text-lg font-semibold text-green-600">
                ✓ Der Kundenmagnet-Weg
              </div>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                <span className="text-sm">QR-Code scannen → Bewerten → Fertig in 30 Sekunden</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                <span className="text-sm">Simple Formulare, optimiert für hohe Conversion</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                <span className="text-sm">Automatisches Widget - immer aktuelle Bewertungen</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                <span className="text-sm">KI-gestützte Spam-Filterung + manuelle Kontrolle</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                <span className="text-sm">Frische Bewertungen erscheinen automatisch</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Zusätzliche Benefits Grid */}
      <div className="mb-16">
        <h3 className="mb-8 text-center text-2xl font-bold">Und das ist noch nicht alles...</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {additionalBenefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                {(() => {
                  const IconComponent = getIcon(benefit.icon)
                  return <IconComponent className="h-6 w-6 text-primary" />
                })()}
              </div>
              <h4 className="mb-2 font-semibold">{benefit.title}</h4>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Statistiken */}
      <div className="mb-16 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">3x</div>
            <div className="mt-1 text-sm">mehr Bewertungen</div>
            <div className="mt-1 text-xs text-muted-foreground">als E-Mail-Anfragen</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">87%</div>
            <div className="mt-1 text-sm">scannen QR-Codes</div>
            <div className="mt-1 text-xs text-muted-foreground">wenn vor Ort angeboten</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">&lt; 30s</div>
            <div className="mt-1 text-sm">zum Bewerten</div>
            <div className="mt-1 text-xs text-muted-foreground">vom Scan bis Submit</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">24/7</div>
            <div className="mt-1 text-sm">automatisch</div>
            <div className="mt-1 text-xs text-muted-foreground">ohne manuellen Aufwand</div>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="mb-16">
        <h3 className="mb-8 text-center text-2xl font-bold">Perfekt für jede Branche</h3>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border p-6">
            <h4 className="mb-3 flex items-center font-semibold">
              <MessageSquare className="mr-2 h-5 w-5 text-primary" />
              Restaurants & Cafés
            </h4>
            <p className="mb-3 text-sm text-muted-foreground">
              QR-Code auf Rechnung oder Tisch. Gäste bewerten noch während des Besuchs.
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• QR-Code auf Speisekarte</li>
              <li>• Tischaufsteller mit Code</li>
              <li>• Kassenbon-Integration</li>
            </ul>
          </div>

          <div className="rounded-lg border p-6">
            <h4 className="mb-3 flex items-center font-semibold">
              <Users className="mr-2 h-5 w-5 text-primary" />
              Einzelhandel & Shops
            </h4>
            <p className="mb-3 text-sm text-muted-foreground">
              An der Kasse oder auf der Rechnung. Kunden teilen ihre Erfahrung direkt.
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Kassenbereich-Display</li>
              <li>• Paketbeileger mit QR</li>
              <li>• E-Mail-Signatur Link</li>
            </ul>
          </div>

          <div className="rounded-lg border p-6">
            <h4 className="mb-3 flex items-center font-semibold">
              <Globe className="mr-2 h-5 w-5 text-primary" />
              Dienstleister & B2B
            </h4>
            <p className="mb-3 text-sm text-muted-foreground">
              Nach Projektabschluss oder Meeting. Professionelles Feedback ohne Aufwand.
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Projekt-Abschluss Mail</li>
              <li>• Meeting-Followup</li>
              <li>• Rechnungs-QR-Code</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <div className="mx-auto max-w-2xl rounded-xl bg-primary p-8 text-primary-foreground">
          <h3 className="mb-3 text-2xl font-bold">Bereit für mehr und bessere Bewertungen?</h3>
          <p className="mb-6 opacity-90">
            Starten Sie jetzt und sammeln Sie Ihre ersten Bewertungen noch heute. 14 Tage kostenlos,
            keine Kreditkarte nötig.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">
              Jetzt kostenlos testen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
