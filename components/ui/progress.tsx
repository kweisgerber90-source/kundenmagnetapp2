// /components/ui/progress.tsx
// Minimaler Progress-Bar Ersatz (ohne zusätzliche Dependencies)

import { cn } from '@/lib/utils'
import * as React from 'react'

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

export function Progress({ value = 0, className, ...props }: ProgressProps) {
  const safe = Number.isFinite(value) ? Math.min(Math.max(value, 0), 100) : 0

  return (
    <div
      className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-200', className)}
      {...props}
    >
      <div className="h-full bg-slate-900" style={{ width: `${safe}%` }} />
    </div>
  )
}
