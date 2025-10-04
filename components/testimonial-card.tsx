// components/testimonial-card.tsx
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'

interface TestimonialCardProps {
  name: string
  text: string
  rating?: number
  date: string
  verified?: boolean
  company?: string
  theme?: 'light' | 'dark' | 'minimal' | 'colorful'
}

export function TestimonialCard({
  name,
  text,
  rating,
  date,
  verified,
  company,
  theme = 'light',
}: TestimonialCardProps) {
  const styles = {
    light: {
      card: 'bg-white text-gray-900 border-gray-200',
      stars: 'text-yellow-400',
      verified: 'bg-blue-100 text-blue-800',
      date: 'text-gray-500',
    },
    dark: {
      card: 'bg-gray-800 text-white border-gray-700',
      stars: 'text-yellow-400',
      verified: 'bg-blue-900 text-blue-200',
      date: 'text-gray-400',
    },
    minimal: {
      card: 'bg-gray-50 text-gray-900 border-transparent',
      stars: 'text-gray-900',
      verified: 'bg-gray-200 text-gray-700',
      date: 'text-gray-600',
    },
    colorful: {
      card: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white border-transparent',
      stars: 'text-yellow-300',
      verified: 'bg-white/20 text-white',
      date: 'text-white/80',
    },
  }

  const currentStyle = styles[theme]

  return (
    <div
      className={`rounded-lg border p-4 shadow-sm transition-all hover:shadow-md ${currentStyle.card}`}
    >
      {rating && (
        <div className="mb-2 flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < rating ? currentStyle.stars : 'opacity-20'}`}
              fill={i < rating ? 'currentColor' : 'none'}
            />
          ))}
        </div>
      )}

      <p className="mb-3 text-sm">{text}</p>

      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{name}</div>
          {company && <div className="text-xs opacity-75">{company}</div>}
        </div>

        <div className="flex items-center gap-2">
          {verified && (
            <Badge variant="secondary" className={`text-xs ${currentStyle.verified}`}>
              Verifiziert
            </Badge>
          )}
          <span className={`text-xs ${currentStyle.date}`}>
            {new Date(date).toLocaleDateString('de-DE')}
          </span>
        </div>
      </div>
    </div>
  )
}
