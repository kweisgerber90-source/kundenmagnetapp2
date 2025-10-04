// components/icons/feature-icons.tsx
'use client'

import { featureIcons } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface FeatureIconProps {
  icon: keyof typeof featureIcons | LucideIcon
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
  background?: boolean
}

export function FeatureIcon({
  icon,
  className,
  size = 'md',
  variant = 'default',
  background = false,
}: FeatureIconProps) {
  const Icon = typeof icon === 'string' ? featureIcons[icon] : icon

  const sizeClasses = {
    sm: {
      icon: 'h-4 w-4',
      bg: 'h-8 w-8',
    },
    md: {
      icon: 'h-6 w-6',
      bg: 'h-12 w-12',
    },
    lg: {
      icon: 'h-8 w-8',
      bg: 'h-16 w-16',
    },
  }

  const variantClasses = {
    default: {
      icon: 'text-foreground',
      bg: 'bg-muted',
    },
    primary: {
      icon: 'text-primary',
      bg: 'bg-primary/10',
    },
    success: {
      icon: 'text-green-600',
      bg: 'bg-green-100',
    },
    warning: {
      icon: 'text-yellow-600',
      bg: 'bg-yellow-100',
    },
    error: {
      icon: 'text-red-600',
      bg: 'bg-red-100',
    },
  }

  if (background) {
    return (
      <div
        className={cn(
          'inline-flex items-center justify-center rounded-lg',
          sizeClasses[size].bg,
          variantClasses[variant].bg,
          className,
        )}
      >
        <Icon className={cn(sizeClasses[size].icon, variantClasses[variant].icon)} />
      </div>
    )
  }

  return <Icon className={cn(sizeClasses[size].icon, variantClasses[variant].icon, className)} />
}
