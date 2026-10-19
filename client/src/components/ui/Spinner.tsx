import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type SpinnerVariant = 'brand' | 'white' | 'slate'

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize
  variant?: SpinnerVariant
  label?: string
}

const sizeMap: Record<SpinnerSize, { box: string; stroke: number; r1: number; r2: number }> = {
  xs: { box: 'size-3.5', stroke: 2, r1: 6, r2: 3 },
  sm: { box: 'size-4', stroke: 2.2, r1: 6.5, r2: 3 },
  md: { box: 'size-6', stroke: 2.5, r1: 9.5, r2: 4.5 },
  lg: { box: 'size-10', stroke: 3, r1: 17, r2: 8 },
  xl: { box: 'size-14', stroke: 3.5, r1: 24, r2: 11 },
}

const variantStroke: Record<SpinnerVariant, { outer: string; inner: string; track: string }> = {
  brand: {
    outer: 'stroke-brand-600 dark:stroke-cyan-400',
    inner: 'stroke-teal-500 dark:stroke-teal-400',
    track: 'stroke-slate-200 dark:stroke-slate-800',
  },
  white: {
    outer: 'stroke-white',
    inner: 'stroke-white/80',
    track: 'stroke-white/20',
  },
  slate: {
    outer: 'stroke-slate-700 dark:stroke-slate-200',
    inner: 'stroke-slate-400',
    track: 'stroke-slate-200 dark:stroke-slate-800',
  },
}

export function Spinner({
  size = 'md',
  variant = 'brand',
  label = 'Loading...',
  className,
  ...props
}: SpinnerProps) {
  const cfg = sizeMap[size]
  const colors = variantStroke[variant]
  const dim = size === 'xs' ? 16 : size === 'sm' ? 18 : size === 'md' ? 24 : size === 'lg' ? 44 : 64
  const c = dim / 2

  return (
    <div
      role="status"
      aria-label={label}
      className={cn('inline-flex items-center justify-center select-none', cfg.box, className)}
      {...props}
    >
      <svg
        viewBox={`0 0 ${dim} ${dim}`}
        fill="none"
        className="size-full animate-spin [animation-duration:900ms]"
      >
        {/* Background track */}
        <circle
          cx={c}
          cy={c}
          r={cfg.r1}
          className={colors.track}
          strokeWidth={cfg.stroke}
          opacity={0.6}
        />
        {/* Main orbital arc */}
        <circle
          cx={c}
          cy={c}
          r={cfg.r1}
          className={colors.outer}
          strokeWidth={cfg.stroke}
          strokeDasharray={`${cfg.r1 * 3.14} ${cfg.r1 * 3.14}`}
          strokeDashoffset={cfg.r1 * 1.5}
          strokeLinecap="round"
        />
        {/* Inner reverse micro arc */}
        {size !== 'xs' && (
          <circle
            cx={c}
            cy={c}
            r={cfg.r2}
            className={colors.inner}
            strokeWidth={cfg.stroke * 0.85}
            strokeDasharray={`${cfg.r2 * 2.5} ${cfg.r2 * 2.5}`}
            strokeDashoffset={cfg.r2}
            strokeLinecap="round"
            opacity={0.85}
          />
        )}
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  )
}
