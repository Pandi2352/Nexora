import { cn } from '@/lib/cn'

export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type LogoVariant = 'full' | 'mark'
export type LogoTheme = 'light' | 'dark'

export interface LogoProps {
  size?: LogoSize
  variant?: LogoVariant
  theme?: LogoTheme
  subtitle?: string
  className?: string
}

const fullSizeConfig: Record<LogoSize, { heightClass: string; height: number; width: number }> = {
  xs: { heightClass: 'h-5', height: 20, width: 82 },
  sm: { heightClass: 'h-6', height: 24, width: 99 },
  md: { heightClass: 'h-8', height: 32, width: 132 },
  lg: { heightClass: 'h-10', height: 40, width: 165 },
  xl: { heightClass: 'h-12', height: 48, width: 198 },
}

const markSizeConfig: Record<LogoSize, { sizeClass: string; dimension: number }> = {
  xs: { sizeClass: 'size-5', dimension: 20 },
  sm: { sizeClass: 'size-6', dimension: 24 },
  md: { sizeClass: 'size-8', dimension: 32 },
  lg: { sizeClass: 'size-10', dimension: 40 },
  xl: { sizeClass: 'size-12', dimension: 48 },
}

/**
 * High-resolution bespoke logo mark (square isometric 'N' emblem).
 */
export function NexoraGlyph({
  size = 'md',
  className = '',
}: {
  size?: LogoSize
  className?: string
}) {
  const config = markSizeConfig[size]

  return (
    <img
      src="/brand/nexora-mark.png"
      alt="Nexora OS"
      width={config.dimension}
      height={config.dimension}
      draggable={false}
      className={cn('shrink-0 select-none object-contain shadow-none', config.sizeClass, className)}
    />
  )
}

/**
 * Unified rectangular brand logo for Nexora OS.
 * Features the 3D isometric emblem, wordmark, and OS badge in a single unified graphic.
 */
export function Logo({
  size = 'md',
  variant = 'full',
  theme: _theme = 'light',
  subtitle,
  className = '',
}: LogoProps) {
  if (variant === 'mark') {
    return <NexoraGlyph size={size} className={className} />
  }

  const config = fullSizeConfig[size]

  return (
    <div className={cn('inline-flex flex-col min-w-0 select-none', className)}>
      <img
        src="/brand/nexora-logo.png"
        alt="Nexora OS"
        width={config.width}
        height={config.height}
        draggable={false}
        className={cn('w-auto select-none object-contain shadow-none', config.heightClass)}
      />

      {subtitle && (
        <span className="truncate text-slate-500 font-normal text-xs pl-8 sm:pl-10 -mt-0.5">
          {subtitle}
        </span>
      )}
    </div>
  )
}

/** Legacy alias for backwards compatibility */
export function LogoMark({ className, size = 'md' }: { className?: string; size?: LogoSize }) {
  return <NexoraGlyph size={size} className={className} />
}


