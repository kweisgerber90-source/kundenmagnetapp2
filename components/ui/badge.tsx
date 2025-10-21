// components/ui/badge.tsx
// Kleine Badge/Label-Komponente.

import { cn } from '@/lib/utils'
import * as React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const styles =
    variant === 'secondary'
      ? 'bg-slate-100 text-slate-900'
      : variant === 'outline'
        ? 'border border-slate-300 text-slate-900'
        : 'bg-slate-900 text-white'
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        styles,
        className,
      )}
      {...props}
    />
  )
}
export default Badge
