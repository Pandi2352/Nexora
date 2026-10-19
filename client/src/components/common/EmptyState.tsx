import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  /** Small line above the title (e.g. "Error 404"). */
  eyebrow?: string
  action?: ReactNode
  /** Small print below the actions (e.g. request ID). */
  footer?: ReactNode
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  eyebrow,
  action,
  footer,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-md border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <span className="flex size-10 items-center justify-center rounded-md bg-slate-100 text-slate-500">
        <Icon className="size-5" aria-hidden />
      </span>
      {eyebrow && (
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
          {eyebrow}
        </p>
      )}
      <h2 className={cn('text-sm font-semibold text-slate-900', eyebrow ? 'mt-1' : 'mt-4')}>
        {title}
      </h2>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
      {footer && <div className="mt-4 text-xs text-slate-500">{footer}</div>}
    </div>
  )
}
