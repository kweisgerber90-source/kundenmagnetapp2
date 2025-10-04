// components/layout/trust-footer.tsx
import { CheckCircle, Globe, Lock, Shield } from '@/lib/icons'
import { cn } from '@/lib/utils'

interface TrustFooterProps {
  variant?: 'simple' | 'detailed'
  className?: string
}

export function TrustFooter({ variant = 'simple', className }: TrustFooterProps) {
  const trustItems = [
    {
      icon: Shield,
      title: 'DSGVO-konform',
      description: 'Datenschutz nach EU-Standard',
    },
    {
      icon: Lock,
      title: 'SSL-verschlüsselt',
      description: 'Sichere Datenübertragung',
    },
    {
      icon: Globe,
      title: 'Server in Deutschland',
      description: 'Hosting in Frankfurt am Main',
    },
    {
      icon: CheckCircle,
      title: '99,9% Verfügbarkeit',
      description: 'Zuverlässiger Service',
    },
  ]

  if (variant === 'simple') {
    return (
      <section className={cn('border-t bg-gray-50 py-8', className)}>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-center">
            {trustItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <item.icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-gray-600">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={cn('border-t bg-gradient-to-b from-gray-50 to-white py-12', className)}>
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <h3 className="mb-8 text-center text-xl font-semibold text-gray-800">
            Vertrauen Sie auf Sicherheit und Qualität
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-sm"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="mb-1 font-semibold text-gray-800">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
