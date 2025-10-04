// components/footer.tsx (updated with better design)
import { BRAND } from '@/lib/constants'
import { Heart, Mail, MapPin, Phone, Shield, Star } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
                <Star className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold">{BRAND.name}</h3>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Die einfachste Lösung für authentische Kundenbewertungen in DACH. Sammeln, moderieren
              und präsentieren Sie Testimonials, die Vertrauen schaffen.
            </p>
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center space-x-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                <Shield className="h-3.5 w-3.5" />
                <span>DSGVO</span>
              </div>
              <div className="flex items-center space-x-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                <MapPin className="h-3.5 w-3.5" />
                <span>Server in DE</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">Produkt</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/features"
                  className="text-gray-600 transition-colors hover:text-blue-600"
                >
                  Funktionen
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-600 transition-colors hover:text-blue-600"
                >
                  Preise
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-gray-600 transition-colors hover:text-blue-600">
                  Dokumentation
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/widget"
                  className="text-gray-600 transition-colors hover:text-blue-600"
                >
                  Widget Integration
                </Link>
              </li>
              <li>
                <Link
                  href="/status"
                  className="flex items-center text-gray-600 transition-colors hover:text-blue-600"
                >
                  System Status
                  <div className="ml-2 h-2 w-2 animate-pulse rounded-full bg-green-500" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">Rechtliches</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/legal/impressum"
                  className="text-gray-600 transition-colors hover:text-blue-600"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/datenschutz"
                  className="text-gray-600 transition-colors hover:text-blue-600"
                >
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/agb"
                  className="text-gray-600 transition-colors hover:text-blue-600"
                >
                  AGB
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/dpa"
                  className="text-gray-600 transition-colors hover:text-blue-600"
                >
                  Auftragsverarbeitung
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">Kontakt</h4>
            <ul className="space-y-3 text-sm">
              <li className="text-gray-600">
                <div className="font-medium text-gray-900">{BRAND.owner}</div>
                <div className="text-xs">{BRAND.legalForm}</div>
              </li>
              <li className="flex items-start space-x-2 text-gray-600">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                <div>
                  {BRAND.address.street}
                  <br />
                  {BRAND.address.zip} {BRAND.address.city}
                </div>
              </li>
              <li>
                <a
                  href={`mailto:${BRAND.email.support}`}
                  className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-blue-600"
                >
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-xs">{BRAND.email.support}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${BRAND.phone}`}
                  className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-blue-600"
                >
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-xs">{BRAND.phone}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} {BRAND.name}. Alle Rechte vorbehalten.
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <span>Made with</span>
              <Heart className="h-4 w-4 animate-pulse text-red-400" />
              <span>in Würzburg</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
