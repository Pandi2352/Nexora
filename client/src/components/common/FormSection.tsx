import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface FormSectionProps {
  icon: LucideIcon
  title: string
  description?: string
  /** Tailwind text colour for the icon, e.g. `text-brand-600`. */
  iconClassName?: string
  className?: string
  children: ReactNode
}

/** Bordered card that groups related fields on full-page forms. */
export function FormSection({
  icon: Icon,
  title,
  description,
  iconClassName,
  className,
  children,
}: FormSectionProps) {
  return (
    <section className={cn('space-y-4 rounded-md border border-slate-200 bg-white p-5', className)}>
      <header className="border-b border-slate-100 pb-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <Icon className={cn('size-4 text-brand-600', iconClassName)} aria-hidden />
          {title}
        </h2>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </header>
      {children}
    </section>
  )
}
