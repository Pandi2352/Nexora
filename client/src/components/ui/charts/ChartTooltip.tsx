import type { ReactNode } from 'react'

interface ChartTooltipPayloadItem {
  name?: string
  value?: number | string
  color?: string
  dataKey?: string
}

interface ChartTooltipProps {
  active?: boolean
  payload?: ChartTooltipPayloadItem[]
  label?: string
  formatter?: (value: number | string) => ReactNode
}

export function ChartTooltip({
  active,
  payload,
  label,
  formatter,
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-md border border-slate-200 bg-white/95 p-2.5 text-xs text-slate-800 backdrop-blur-[2px]">
      {label && <div className="mb-1.5 font-semibold text-slate-700">{label}</div>}
      <div className="space-y-1">
        {payload.map((item, i) => (
          <div key={`tooltip-${item.dataKey || i}`} className="flex items-center gap-2">
            <span
              className="size-2 rounded-full shrink-0"
              style={{ backgroundColor: item.color || '#6366f1' }}
            />
            <span className="text-[11px] text-slate-500 capitalize">
              {item.name || item.dataKey}:
            </span>
            <span className="font-semibold text-slate-900 font-mono">
              {formatter ? formatter(item.value ?? 0) : item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
