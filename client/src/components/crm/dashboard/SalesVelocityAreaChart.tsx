import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Badge } from '@/components/ui'
import { ChartContainer } from '@/components/ui/charts/ChartContainer'
import { ChartTooltip } from '@/components/ui/charts/ChartTooltip'

export interface VelocityDataPoint {
  period: string
  activities: number
  dealsTouched: number
}

interface SalesVelocityAreaChartProps {
  data: VelocityDataPoint[]
}

export function SalesVelocityAreaChart({ data }: SalesVelocityAreaChartProps) {
  const totalTouches = data.reduce((sum, d) => sum + d.activities, 0)

  return (
    <ChartContainer
      title="Sales Touchpoint Velocity"
      description="Weekly cadence of discovery meetings, calls, and active deal engagements"
      actions={
        <Badge variant="brand" size="sm">
          {totalTouches} Total Touches
        </Badge>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="velocityIndigoGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="velocityTealGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="period"
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#64748b', fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#64748b', fontSize: 11 }}
          />
          <Tooltip
            content={
              <ChartTooltip
                formatter={(v) => `${v} events`}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="activities"
            name="Sales Activities"
            stroke="#6366f1"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#velocityIndigoGrad)"
          />
          <Area
            type="monotone"
            dataKey="dealsTouched"
            name="Deals Progressed"
            stroke="#06b6d4"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#velocityTealGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
