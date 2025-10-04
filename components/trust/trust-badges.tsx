// components/trust/trust-badges.tsx
import { Award, CheckCircle, Clock, Shield } from '@/lib/icons'
import { cn } from '@/lib/utils'

interface TrustBadgesProps {
  variant?: 'compact' | 'detailed'
  className?: string
}

export function TrustBadges({ variant = 'compact', className }: TrustBadgesProps) {
  const badges = [
    {
      icon: CheckCircle,
      text: '14 Tage kostenlos',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Shield,
      text: 'DSGVO-konform',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Award,
      text: '500+ Kunden',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Clock,
      text: 'Support 24/7',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  if (variant === 'compact') {
    return (
      <div className={cn('flex flex-wrap justify-center gap-3', className)}>
        {badges.map((badge, index) => (
          <div
            key={index}
            className={cn(
              'flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium',
              badge.bgColor,
              badge.color,
            )}
          >
            <badge.icon className="h-3 w-3" />
            {badge.text}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {badges.map((badge, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-lg border bg-white p-4 shadow-sm"
        >
          <div className={cn('rounded-full p-2', badge.bgColor)}>
            <badge.icon className={cn('h-5 w-5', badge.color)} />
          </div>
          <div>
            <p className="font-semibold text-gray-800">{badge.text}</p>
            <p className="text-xs text-gray-500">Garantiert</p>
          </div>
        </div>
      ))}
    </div>
  )
}
