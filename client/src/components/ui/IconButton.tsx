import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

interface IconButtonProps extends ComponentProps<'button'> {
  /** Accessible name; also shown as a tooltip. */
  'aria-label': string
  size?: 'sm' | 'md'
}

export function IconButton({
  size = 'md',
  className,
  type = 'button',
  title,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      title={title ?? props['aria-label']}
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors',
        'hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        size === 'sm' ? 'size-8' : 'size-9',
        className,
      )}
      {...props}
    />
  )
}
