import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { ChartContainer } from '@/components/ui/charts/ChartContainer'
import { ChartTooltip } from '@/components/ui/charts/ChartTooltip'

export interface DistributionItem {
  name: string
  value: number
  color: string
}

interface TeamDistributionChartProps {
  data?: DistributionItem[]
  totalCount?: number
}

const DEFAULT_DATA: DistributionItem[] = [
  { name: 'Engineering', value: 8, color: '#4f46e5' },
  { name: 'Sales & CRM', value: 5, color: '#06b6d4' },
  { name: 'Customer Support', value: 4, color: '#10b981' },
  { name: 'Operations', value: 3, color: '#f59e0b' },
  { name: 'Administration', value: 2, color: '#8b5cf6' },
]

export function TeamDistributionChart({
  data = DEFAULT_DATA,
  totalCount,
}: TeamDistributionChartProps) {
  const total = totalCount ?? data.reduce((acc, d) => acc + d.value, 0)

  return (
    <ChartContainer
      title="Team Member Distribution"
      description="Member allocation across functional departments"
    >
      <div className="flex h-full flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative size-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={
                  <ChartTooltip
                    formatter={(v) => `${v} members (${total > 0 ? Math.round(((Number(v) / total) * 100)) : 0}%)`}
                  />
                }
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={72}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-slate-900 font-mono">{total}</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              Members
            </span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {data.map((item) => {
            const pct = total > 0 ? Math.round((item.value / total) * 100) : 0
            return (
              <div
                key={item.name}
                className="flex items-center justify-between gap-2 text-xs py-1 px-2 rounded-md hover:bg-slate-50"
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-slate-700 truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] shrink-0 text-slate-500">
                  <span>{item.value}</span>
                  <span className="w-8 text-right text-slate-400">{pct}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </ChartContainer>
  )
}
