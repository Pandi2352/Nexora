import { cn } from '@/lib/cn'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  /** `square` for organizations, `circle` for people. */
  shape?: 'circle' | 'square'
  className?: string
}

const sizes = {
  sm: 'size-7 text-[11px]',
  md: 'size-9 text-xs',
  lg: 'size-10 text-sm',
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

export function Avatar({ name, size = 'md', shape = 'circle', className }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center bg-brand-100 font-semibold text-brand-700',
        shape === 'circle' ? 'rounded-full' : 'rounded-md',
        sizes[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}
