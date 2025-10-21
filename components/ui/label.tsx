// components/ui/label.tsx
// Beschriftungen im einheitlichen Stil.

import { cn } from '@/lib/utils'
import * as React from 'react'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className, ...props }: LabelProps) {
  return <label className={cn('mb-1 block text-sm text-slate-700', className)} {...props} />
}
export default Label
