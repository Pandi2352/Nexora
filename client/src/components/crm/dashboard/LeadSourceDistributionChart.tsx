import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { ChartContainer } from '@/components/ui/charts/ChartContainer'
import { ChartTooltip } from '@/components/ui/charts/ChartTooltip'

export interface LeadSourceItem {
  source: string
  label: string
  count: number
  color: string
}

interface LeadSourceDistributionChartProps {
  data: LeadSourceItem[]
  totalLeads: number
}

export function LeadSourceDistributionChart({
  data,
  totalLeads,
}: LeadSourceDistributionChartProps) {
  return (
    <ChartContainer
      title="Lead Acquisition Channels"
      description="Inbound vs outbound sources driving enterprise pipeline"
    >
      <div className="flex h-full flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative size-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={
                  <ChartTooltip
                    formatter={(v) =>
                      `${v} leads (${totalLeads > 0 ? Math.round((Number(v) / totalLeads) * 100) : 0}%)`
                    }
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
                dataKey="count"
              >
                {data.map((entry, index) => (
                  <Cell key={`source-cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-slate-900 font-mono">{totalLeads}</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              Leads
            </span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
          {data.map((item) => {
            const pct = totalLeads > 0 ? Math.round((item.count / totalLeads) * 100) : 0
            return (
              <div
                key={item.source}
                className="flex items-center justify-between gap-2 text-xs py-1 px-2 rounded-md hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="size-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-slate-700 truncate">{item.label}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] shrink-0 text-slate-500">
                  <span className="font-semibold text-slate-800">{item.count}</span>
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
