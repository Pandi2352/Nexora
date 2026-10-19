import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type BadgeVariant = 'neutral' | 'brand' | 'success' | 'warning' | 'critical'
export type BadgeSize = 'sm' | 'md'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  children: ReactNode
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'border border-slate-200 bg-slate-50 text-slate-700',
  brand: 'border border-brand-200 bg-brand-50 text-brand-700',
  success: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border border-amber-200 bg-amber-50 text-amber-800',
  critical: 'border border-rose-200 bg-rose-50 text-rose-700',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
}

export function Badge({
  variant = 'neutral',
  size = 'sm',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-md tracking-normal select-none',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
