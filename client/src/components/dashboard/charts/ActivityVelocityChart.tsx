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

interface VelocityDataPoint {
  day: string
  actions: number
  security: number
}

interface ActivityVelocityChartProps {
  data?: VelocityDataPoint[]
}

const DEFAULT_DATA: VelocityDataPoint[] = [
  { day: 'Mon', actions: 12, security: 3 },
  { day: 'Tue', actions: 24, security: 5 },
  { day: 'Wed', actions: 18, security: 2 },
  { day: 'Thu', actions: 38, security: 7 },
  { day: 'Fri', actions: 42, security: 6 },
  { day: 'Sat', actions: 15, security: 1 },
  { day: 'Sun', actions: 28, security: 4 },
]

export function ActivityVelocityChart({ data = DEFAULT_DATA }: ActivityVelocityChartProps) {
  const totalEvents = data.reduce((acc, d) => acc + d.actions + d.security, 0)

  return (
    <ChartContainer
      title="Operational Velocity"
      description="Daily security checks and operations across this workspace"
      actions={
        <Badge variant="brand" size="sm">
          {totalEvents} Total Events
        </Badge>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="brandAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="tealAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="day"
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
            dataKey="actions"
            name="Operations"
            stroke="#4f46e5"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#brandAreaGrad)"
          />
          <Area
            type="monotone"
            dataKey="security"
            name="Security & Auth"
            stroke="#06b6d4"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#tealAreaGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
