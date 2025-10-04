// app/features/page.tsx (updated)
import { ComparisonTable } from '@/components/comparison-table'
import { FeatureCard } from '@/components/feature-card'
import { Button } from '@/components/ui/button'
import { generatePageMetadata } from '@/lib/metadata'
import {
  BarChart3,
  Gauge,
  HeartHandshake,
  Layers,
  Lock,
  Mail,
  QrCode,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react'
import Link from 'next/link'

export const metadata = generatePageMetadata(
  'Funktionen',
  'Alle Funktionen von Kundenmagnetapp im Überblick. QR-Codes, Moderation, Widget und mehr.',
  '/features',
)

export default function FeaturesPage() {
  const features = [
    {
      icon: QrCode,
      title: 'QR-Code Generator',
      description:
        'Erstellen Sie in Sekunden professionelle QR-Codes für Ihre Bewertungskampagnen.',
      features: [
        'Druckfertige Vorlagen in verschiedenen Größen',
        'Anpassbares Design mit Ihrem Logo',
        'Tracking von Scans und Conversions',
        'Mehrere QR-Codes pro Kampagne möglich',
      ],
      badge: 'Beliebt',
      highlight: true,
    },
    {
      icon: Shield,
      title: 'Intelligente Moderation',
      description: 'Behalten Sie die volle Kontrolle über veröffentlichte Bewertungen.',
      features: [
        'Automatische Spam-Erkennung',
        'Manuelle Freigabe-Warteschlange',
        'Blacklist für problematische Begriffe',
        'E-Mail-Benachrichtigungen bei neuen Reviews',
      ],
    },
    {
      icon: Sparkles,
      title: 'Widget-System',
      description: 'Zeigen Sie Bewertungen automatisch und stilvoll auf Ihrer Website.',
      features: [
        'Mehrere Design-Themes',
        'Responsive für alle Geräte',
        'SEO-optimiert für bessere Rankings',
        'Lädt asynchron ohne Performance-Verlust',
      ],
    },
    {
      icon: Mail,
      title: 'Ohne E-Mail-Chaos',
      description: 'Direkter Bewertungslink statt endloser E-Mail-Ketten.',
      features: [
        'Personalisierte Bewertungslinks',
        'Kein Account nötig für Bewerter',
        'Mobile-optimierte Formulare',
        'Multi-Language Support',
      ],
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Verstehen Sie Ihre Kunden mit detaillierten Auswertungen.',
      features: [
        'Conversion-Tracking',
        'Sentiment-Analyse',
        'Export als CSV oder PDF',
        'Trend-Analysen über Zeit',
      ],
    },
    {
      icon: Lock,
      title: 'DSGVO & Sicherheit',
      description: 'Höchste Datenschutz-Standards und Sicherheit.',
      features: [
        'Server in Deutschland (Frankfurt)',
        'Vollständig DSGVO-konform',
        'SSL-Verschlüsselung',
        'Regelmäßige Sicherheits-Audits',
      ],
    },
    {
      icon: Gauge,
      title: 'Blitzschnell',
      description: 'Von der Einrichtung bis zur ersten Bewertung in Minuten.',
      features: [
        '5 Minuten Setup',
        'Keine technischen Kenntnisse nötig',
        'Vorgefertigte Templates',
        'Sofort einsatzbereit',
      ],
    },
    {
      icon: Layers,
      title: 'Integrationen',
      description: 'Funktioniert mit allen gängigen Plattformen.',
      features: [
        'WordPress & WooCommerce',
        'Shopify & Shopware',
        'Wix, Jimdo, Squarespace',
        'API für Custom-Integrationen',
      ],
    },
    {
      icon: HeartHandshake,
      title: 'Deutscher Support',
      description: 'Persönlicher Support, der Ihre Sprache spricht.',
      features: [
        'Support auf Deutsch',
        'Antwort innerhalb 24 Stunden',
        'Video-Tutorials auf Deutsch',
        'Persönlicher Onboarding-Call',
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          Alles was Sie brauchen für erfolgreiche Kundenbewertungen
        </h1>
        <p className="text-lg text-muted-foreground">
          Kundenmagnetapp bietet Ihnen alle Tools, um mehr und bessere Bewertungen zu sammeln, zu
          moderieren und wirkungsvoll zu präsentieren.
        </p>
      </div>

      {/* Features Grid */}
      <div className="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>

      {/* Comparison Section */}
      <div className="mb-16">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-3xl font-bold">Kundenmagnetapp vs. Alternativen</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Sehen Sie auf einen Blick, warum Kundenmagnetapp die beste Wahl für Unternehmen in DACH
            ist.
          </p>
        </div>
        <ComparisonTable />
      </div>

      {/* Feature Details */}
      <div className="mb-16 space-y-16">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <div className="mb-4 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <QrCode className="mr-2 h-4 w-4" />
              QR-Code Feature
            </div>
            <h3 className="mb-4 text-2xl font-bold">QR-Codes die Ihre Kunden wirklich scannen</h3>
            <p className="mb-4 text-muted-foreground">
              87% der Kunden scannen QR-Codes, wenn sie gut platziert sind. Mit Kundenmagnetapp
              erstellen Sie in Sekunden professionelle QR-Codes, die zu mehr Bewertungen führen.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>Druckfertig in verschiedenen Formaten (PNG, SVG, PDF)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>Mit Ihrem Logo und Branding</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>Tracking: Wer scannt wann und wo</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>A/B Testing mit mehreren QR-Codes</span>
              </li>
            </ul>
          </div>
          <div className="rounded-lg bg-muted/50 p-8 text-center">
            <QrCode className="mx-auto h-48 w-48 text-primary/20" />
            <p className="mt-4 text-sm text-muted-foreground">
              Beispiel QR-Code - In der App mit Ihrem Branding
            </p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="order-2 rounded-lg bg-muted/50 p-8 md:order-1">
            <div className="space-y-4">
              <div className="rounded-lg border bg-background p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold">Neue Bewertung</span>
                  <span className="text-sm text-muted-foreground">vor 2 Min</span>
                </div>
                <p className="text-sm">&quot;Super Service, sehr zufrieden!&quot;</p>
                <div className="mt-3 flex gap-2">
                  <button className="rounded bg-green-500 px-3 py-1 text-sm text-white">
                    Freigeben
                  </button>
                  <button className="rounded border px-3 py-1 text-sm">Ablehnen</button>
                </div>
              </div>
              <div className="rounded-lg border bg-background p-4 opacity-60">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold">Spam erkannt</span>
                  <span className="text-sm text-red-500">Automatisch blockiert</span>
                </div>
                <p className="text-sm line-through">&quot;Click here for free...&quot;</p>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="mb-4 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <Shield className="mr-2 h-4 w-4" />
              Moderation
            </div>
            <h3 className="mb-4 text-2xl font-bold">Volle Kontrolle über Ihre Online-Reputation</h3>
            <p className="mb-4 text-muted-foreground">
              Nicht jede Bewertung sollte sofort online gehen. Mit unserer intelligenten Moderation
              behalten Sie die Kontrolle, ohne den Überblick zu verlieren.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>KI erkennt Spam und verdächtige Inhalte</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>Freigabe-Warteschlange mit Vorschau</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>Batch-Aktionen für schnelle Bearbeitung</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>E-Mail-Alerts bei kritischen Bewertungen</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <div className="mb-4 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <Sparkles className="mr-2 h-4 w-4" />
              Widget
            </div>
            <h3 className="mb-4 text-2xl font-bold">Ein Widget, tausend Möglichkeiten</h3>
            <p className="mb-4 text-muted-foreground">
              Unser Widget passt sich perfekt an Ihre Website an. Egal ob WordPress, Shopify oder
              selbst programmiert - eine Zeile Code genügt.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>4 vorgefertigte Themes + Custom CSS</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>Responsive & Mobile-optimiert</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>Lädt asynchron (blockiert nicht)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">✓</span>
                <span>SEO-Markup für bessere Rankings</span>
              </li>
            </ul>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-8">
            <code className="text-sm">
              {`<div id="kundenmagnet-widget" 
  data-campaign="ihre-kampagne"
  data-theme="light"
  data-limit="6">
</div>
<script src="https://kundenmagnet-app.de/widget.js"></script>`}
            </code>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              So einfach ist die Integration
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="rounded-xl bg-gradient-to-r from-primary to-primary/80 p-8 text-center text-primary-foreground md:p-12">
        <h2 className="mb-4 text-3xl font-bold">Überzeugt? Starten Sie jetzt!</h2>
        <p className="mb-6 text-lg opacity-90">
          Testen Sie Kundenmagnetapp 14 Tage kostenlos und unverbindlich. Keine Kreditkarte
          erforderlich.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">
              Kostenlos testen
              <Zap className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white bg-transparent text-white hover:bg-white/10"
            asChild
          >
            <Link href="/pricing">Preise ansehen</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
