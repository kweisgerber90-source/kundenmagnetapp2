// /app/app/page.tsx
// Dashboard mit echten Statistiken aus Supabase

import { createClient, getUser } from '@/lib/supabase/server'
import { Code2, MessageSquare, QrCode, TrendingUp, type LucideIcon } from 'lucide-react'
import type { Route } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type IconType = LucideIcon

interface QuickAction {
  title: string
  description: string
  href: Route
  icon: IconType
  color: string
}

export default async function DashboardPage() {
  const user = await getUser()
  if (!user) redirect('/login')

  // Statistiken aus Supabase laden
  const supabase = await createClient()

  // Kampagnen zählen
  const { count: campaignsCount } = await supabase
    .from('campaigns')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Testimonials zählen
  const { count: testimonialsCount } = await supabase
    .from('testimonials')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // QR-Codes zählen
  const { count: qrCodesCount } = await supabase
    .from('qr_codes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const quickActions: QuickAction[] = [
    {
      title: 'Neue Kampagne',
      description: 'Erstelle eine neue Bewertungskampagne',
      href: '/app/kampagnen' as Route,
      icon: MessageSquare as IconType,
      color: 'bg-blue-500',
    },
    {
      title: 'QR-Code erstellen',
      description: 'Generiere einen QR-Code für Offline-Bewertungen',
      href: '/app/qr' as Route,
      icon: QrCode as IconType,
      color: 'bg-purple-500',
    },
    {
      title: 'Widget einbetten',
      description: 'Bette Testimonials auf deiner Website ein',
      href: '/app/widget' as Route,
      icon: Code2 as IconType,
      color: 'bg-green-500',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Willkommen zurück 👋</h1>
        <p className="mt-2 text-gray-600">
          Angemeldet als <span className="font-medium">{user.email}</span>.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Kampagnen</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{campaignsCount ?? 0}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Testimonials</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{testimonialsCount ?? 0}</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">QR-Codes</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{qrCodesCount ?? 0}</p>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <QrCode className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900">Schnellzugriff</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 hover:shadow-md"
              >
                <div className="flex items-start space-x-4">
                  <div className={`rounded-lg ${action.color} p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                      {action.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
        <h3 className="font-semibold text-blue-900">🚀 Erste Schritte</h3>
        <ol className="mt-4 space-y-2 text-sm text-blue-800">
          <li>1. Erstelle deine erste Kampagne</li>
          <li>2. Teile den Bewertungslink oder QR-Code mit deinen Kunden</li>
          <li>3. Moderiere eingehende Testimonials</li>
          <li>4. Bette das Widget auf deiner Website ein</li>
        </ol>
        <Link
          href={'/docs' as Route}
          className="mt-4 inline-block text-sm font-medium text-blue-700 hover:text-blue-800"
        >
          Dokumentation ansehen →
        </Link>
      </div>
    </div>
  )
}
