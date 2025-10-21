// components/ui/button.tsx
// Einfache, robuste Button-Komponente im Kundenmagnetapp-Stil.
// Unterstützt optional asChild (Radix Slot), aber ohne cva.

import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: 'default' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const base =
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:opacity-60 disabled:pointer-events-none'

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  default: 'bg-slate-900 text-white hover:bg-slate-800',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-900',
  outline: 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
}

// Für Kompatibilität exportieren wir auch buttonVariants:
export function buttonVariants(opts?: {
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
  className?: string
}) {
  const v = opts?.variant ?? 'default'
  const s = opts?.size ?? 'md'
  return cn(base, variants[v], sizes[s], opts?.className)
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', asChild = false, ...props }, ref) => {
    const Comp: React.ElementType = asChild ? Slot : 'button'
    return (
      <Comp ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
    )
  },
)
Button.displayName = 'Button'
export default Button
