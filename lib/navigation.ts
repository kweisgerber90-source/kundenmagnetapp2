// /lib/navigation.ts
// ----------------------------------------------------------------------------
// Navigation-Konfiguration (fix für Next Typed Routes)
// ----------------------------------------------------------------------------

import {
  Code2,
  CreditCard,
  LayoutDashboard,
  MessageSquare,
  QrCode,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import type { Route } from 'next'

export interface NavItem {
  title: string
  href: Route // 🔧 Korrektur: Route statt string
  icon: LucideIcon
  description?: string
}

export const mainNavigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/app' as Route, // 🔧 Expliziter Cast
    icon: LayoutDashboard,
    description: 'Übersicht und Schnellzugriff',
  },
  {
    title: 'Kampagnen',
    href: '/app/kampagnen' as Route, // 🔧
    icon: MessageSquare,
    description: 'Kampagnen verwalten',
  },
  {
    title: 'Testimonials',
    href: '/app/testimonials' as Route, // 🔧
    icon: MessageSquare,
    description: 'Bewertungen moderieren',
  },
  {
    title: 'Widget',
    href: '/app/widget' as Route, // 🔧
    icon: Code2,
    description: 'Widget einbetten',
  },
  {
    title: 'QR-Codes',
    href: '/app/qr' as Route, // 🔧
    icon: QrCode,
    description: 'QR-Codes erstellen',
  },
  {
    title: 'Einstellungen',
    href: '/app/einstellungen' as Route, // 🔧
    icon: Settings,
    description: 'Konto & Profil',
  },
  {
    title: 'Abrechnung',
    href: '/app/abrechnung' as Route, // 🔧
    icon: CreditCard,
    description: 'Plan & Rechnungen',
  },
]
