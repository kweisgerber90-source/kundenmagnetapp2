// components/trust/trust-banner.tsx
import { cn } from '@/lib/utils'

interface TrustBannerProps {
  animated?: boolean
  className?: string
}

export function TrustBanner({ animated = true, className }: TrustBannerProps) {
  const stats = [
    { value: '500+', label: 'Zufriedene Kunden' },
    { value: '10.000+', label: 'Bewertungen gesammelt' },
    { value: '99,9%', label: 'Verfügbarkeit' },
    { value: '24/7', label: 'Support' },
  ]

  return (
    <div className={cn('py-8', className)}>
      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold text-gray-800">
          Vertrauen Sie auf bewährte Qualität
        </h2>
        <p className="mb-8 text-sm text-gray-600">
          Über 500 Unternehmen sammeln bereits erfolgreich Bewertungen mit uns
        </p>

        <div
          className={cn('grid grid-cols-2 gap-6 md:grid-cols-4', animated && 'animate-fade-in-up')}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center"
              style={{
                animationDelay: animated ? `${index * 100}ms` : '0ms',
              }}
            >
              <div className="text-2xl font-bold text-primary md:text-3xl">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
