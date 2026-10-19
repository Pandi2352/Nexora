import type { ReactNode } from 'react'

interface ChartContainerProps {
  title: string
  description?: string
  actions?: ReactNode
  heightClassName?: string
  children: ReactNode
}

export function ChartContainer({
  title,
  description,
  actions,
  heightClassName = 'h-64 sm:h-72',
  children,
}: ChartContainerProps) {
  return (
    <div className="flex flex-col justify-between rounded-md border border-slate-200 bg-white p-5 transition-colors">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {description && (
            <p className="mt-0.5 text-xs text-slate-500">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      <div className={`w-full ${heightClassName}`}>{children}</div>
    </div>
  )
}
