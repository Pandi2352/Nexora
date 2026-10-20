import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Badge } from '@/components/ui'
import { ChartContainer } from '@/components/ui/charts/ChartContainer'
import { ChartTooltip } from '@/components/ui/charts/ChartTooltip'
import { formatINR } from '../crm-formatters'

export interface FunnelStageData {
  stage: string
  label: string
  count: number
  value: number
  color: string
}

interface PipelineFunnelChartProps {
  data: FunnelStageData[]
  totalPipelineINR: number
}

export function PipelineFunnelChart({ data, totalPipelineINR }: PipelineFunnelChartProps) {
  return (
    <ChartContainer
      title="Sales Pipeline & Conversion Stages"
      description="Active deal count and total contract value (₹) across the sales lifecycle"
      actions={
        <Badge variant="brand" size="sm">
          Total: {formatINR(totalPipelineINR)}
        </Badge>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="horizontal"
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="label"
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
            dataKey="value"
            radius={[4, 4, 0, 0]}
            maxBarSize={48}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
