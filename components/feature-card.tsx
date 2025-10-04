// components/feature-card.tsx
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  features: string[]
  badge?: string
  highlight?: boolean
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  features,
  badge,
  highlight = false,
}: FeatureCardProps) {
  return (
    <Card className={`relative ${highlight ? 'border-primary shadow-lg' : ''}`}>
      {badge && (
        <div className="absolute -top-3 left-6">
          <Badge className="bg-primary">{badge}</Badge>
        </div>
      )}
      <CardHeader>
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start text-sm">
              <span className="mr-2 text-primary">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
