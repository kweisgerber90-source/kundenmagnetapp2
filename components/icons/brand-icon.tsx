// components/icons/brand-icon.tsx
'use client'

import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

interface BrandIconProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
}

export function BrandIcon({ className, size = 'md', animated = false }: BrandIconProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  }

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <Star
        className={cn(sizeClasses[size], 'fill-primary text-primary', animated && 'animate-pulse')}
      />
      {animated && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Star
            className={cn(sizeClasses[size], 'animate-ping fill-primary text-primary opacity-75')}
          />
        </div>
      )}
    </div>
  )
}
