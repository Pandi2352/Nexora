import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-1.5 font-sans text-[10px] font-medium text-slate-500',
        className,
      )}
    >
      {children}
    </kbd>
  )
}
