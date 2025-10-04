// app/page.tsx (updated with better design)
import { BenefitsSection } from '@/components/benefits-section'
import { TrustFooter } from '@/components/layout/trust-footer'
import { SEOJsonLD } from '@/components/seo-jsonld'
import { PrivacyHint } from '@/components/trust/privacy-hint'
import { SecuritySeal } from '@/components/trust/security-seal'
import { TrustBadges } from '@/components/trust/trust-badges'
import { TrustBanner } from '@/components/trust/trust-banner'
import { Button } from '@/components/ui/button'
import { WidgetPreview } from '@/components/widget-preview'
import { ArrowRight, CheckCircle, Clock, QrCode, Shield, Sparkles, Zap } from '@/lib/icons'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <SEOJsonLD type="Product" />
      <SEOJsonLD type="FAQPage" />

      {/* Hero Section with gradient background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Decorative elements */}
        <div className="bg-pattern absolute inset-0 opacity-50" />
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl" />

        <div className="container relative mx-auto px-4 py-20 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="shadow-soft mb-6 inline-flex items-center rounded-full bg-blue-100/80 px-4 py-2 text-sm font-medium text-blue-700">
              <Sparkles className="mr-2 h-4 w-4 text-blue-600" />
              Über 500+ Unternehmen vertrauen uns
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Kundenbewertungen die <span className="gradient-hero">wirklich funktionieren</span>
            </h1>

            <p className="mb-8 text-lg text-gray-600 sm:text-xl">
              Sammeln Sie authentische Testimonials ohne E-Mail Ping-Pong. Mit QR-Codes vor Ort,
              automatischer Moderation und einem Widget, das auf jeder Website funktioniert.
            </p>

            {/* Trust Badges with better colors */}
            <div className="mb-8 flex justify-center">
              <TrustBadges variant="compact" />
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                asChild
              >
                <Link href="/register">
                  <Zap className="mr-2 h-4 w-4" />
                  14 Tage kostenlos testen
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
                asChild
              >
                <Link href="/demo">Live Demo ansehen</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center text-gray-600">
                <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                </div>
                Keine Kreditkarte erforderlich
              </div>
              <div className="flex items-center text-gray-600">
                <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100">
                  <Shield className="h-3 w-3 text-blue-600" />
                </div>
                DSGVO-konform
              </div>
              <div className="flex items-center text-gray-600">
                <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-100">
                  <QrCode className="h-3 w-3 text-purple-600" />
                </div>
                QR-Code inklusive
              </div>
            </div>

            {/* Privacy Hint */}
            <div className="mt-6 flex justify-center">
              <PrivacyHint variant="inline" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner with colored background */}
      <section className="border-y border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <TrustBanner animated={false} />
        </div>
      </section>

      {/* Security Seal floating button */}
      <SecuritySeal variant="floating" />

      {/* Benefits Section with cards */}
      <section className="container mx-auto px-4 py-16">
        <BenefitsSection />
      </section>

      {/* Privacy Banner with blue theme */}
      <section className="container mx-auto px-4 py-8">
        <PrivacyHint variant="banner" dismissible />
      </section>

      {/* Widget Preview Section with background */}
      <section className="bg-gradient-to-b from-white via-blue-50/30 to-white py-16">
        <div className="container mx-auto px-4">
          <WidgetPreview />
        </div>
      </section>

      {/* Detailed Trust Badges */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h3 className="mb-8 text-center text-2xl font-bold">
            Sicherheit & Datenschutz an erster Stelle
          </h3>
          <TrustBadges variant="detailed" />
        </div>
      </section>

      {/* Features Grid with colored icons */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="shadow-soft rounded-2xl bg-white/80 p-8 backdrop-blur">
            <h3 className="mb-8 text-center text-2xl font-bold">Ihre Vorteile auf einen Blick</h3>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="group flex flex-col items-center text-center transition-transform hover:scale-105">
                <div className="shadow-soft mb-3 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 p-4">
                  <QrCode className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold">QR-Codes</h4>
                <p className="mt-1 text-sm text-gray-600">Druckfertig in Sekunden</p>
              </div>
              <div className="group flex flex-col items-center text-center transition-transform hover:scale-105">
                <div className="shadow-soft mb-3 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 p-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold">Moderation</h4>
                <p className="mt-1 text-sm text-gray-600">Volle Kontrolle behalten</p>
              </div>
              <div className="group flex flex-col items-center text-center transition-transform hover:scale-105">
                <div className="shadow-soft mb-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 p-4">
                  <Sparkles className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-semibold">Widget</h4>
                <p className="mt-1 text-sm text-gray-600">Eine Zeile Code genügt</p>
              </div>
              <div className="group flex flex-col items-center text-center transition-transform hover:scale-105">
                <div className="shadow-soft mb-3 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 p-4">
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="font-semibold">Analytics</h4>
                <p className="mt-1 text-sm text-gray-600">Insights die weiterbringen</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with gradient */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-12 text-white shadow-2xl">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

            <div className="relative text-center">
              <h2 className="mb-4 text-3xl font-bold">Bereit für bessere Kundenbewertungen?</h2>
              <p className="mb-8 text-lg text-blue-100">
                Starten Sie noch heute Ihre 14-tägige kostenlose Testphase
              </p>
              <Button
                size="lg"
                className="bg-white text-blue-600 shadow-lg hover:bg-gray-50"
                asChild
              >
                <Link href="/register">
                  Jetzt kostenlos starten
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Footer */}
      <TrustFooter variant="detailed" />
    </>
  )
}
