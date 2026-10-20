import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartContainer } from '@/components/ui/charts/ChartContainer'
import { ChartTooltip } from '@/components/ui/charts/ChartTooltip'
import { formatINR } from '../crm-formatters'

export interface BuQuotaItem {
  name: string
  quotaINR: number
  dealsCount: number
  color: string
}

interface BusinessUnitQuotaChartProps {
  data: BuQuotaItem[]
}

export function BusinessUnitQuotaChart({ data }: BusinessUnitQuotaChartProps) {
  return (
    <ChartContainer
      title="Revenue Quota by Business Unit"
      description="Distribution of deal targets across operating business units"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="horizontal"
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#64748b', fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
            tick={{ fill: '#64748b', fontSize: 11 }}
          />
          <Tooltip
            content={
              <ChartTooltip
                formatter={(v) => formatINR(Number(v))}
              />
            }
          />
          <Bar
            dataKey="quotaINR"
            radius={[4, 4, 0, 0]}
            maxBarSize={44}
          >
            {data.map((entry, index) => (
              <Cell key={`bu-bar-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
