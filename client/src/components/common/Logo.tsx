import { Hexagon } from 'lucide-react'
import { cn } from '@/lib/cn'

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-brand-600 text-white',
        className,
      )}
    >
      <Hexagon className="size-5" strokeWidth={2} />
    </span>
  )
}
