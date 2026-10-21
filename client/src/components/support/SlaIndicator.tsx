import { AlarmClock, CheckCircle2, PauseCircle, TriangleAlert } from 'lucide-react'
import { Tooltip } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { SlaTimer } from '@/types/support'
import { formatDateTime, formatRelative } from './support-formatters'
import { SLA_META } from './support-options'

const ICONS = {
  on_track: AlarmClock,
  at_risk: AlarmClock,
  breached: TriangleAlert,
  met: CheckCircle2,
  paused: PauseCircle,
}

interface SlaIndicatorProps {
  label: string
  timer: SlaTimer
  /** Stacked, non-wrapping layout with rounded durations, for tables. */
  compact?: boolean
}

/** SLA state with due time ("due in 2 h", "breached 3 h ago", "met"). */
export function SlaIndicator({ label, timer, compact = false }: SlaIndicatorProps) {
  const meta = SLA_META[timer.state]
  const Icon = ICONS[timer.state]
  const when =
    timer.state === 'met'
      ? formatRelative(timer.completedAt, new Date(), compact)
      : `due ${formatRelative(timer.dueAt, new Date(), compact)}`

  if (compact) {
    return (
      <Tooltip content={`${label} target: ${formatDateTime(timer.dueAt)}`}>
        <span className={cn('inline-flex flex-col whitespace-nowrap text-xs', meta.className)}>
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <Icon className="size-3.5 shrink-0" aria-hidden />
            {meta.label}
          </span>
          <span className="pl-5 text-[11px] text-slate-500">{when}</span>
        </span>
      </Tooltip>
    )
  }

  return (
    <Tooltip content={`${label} target: ${formatDateTime(timer.dueAt)}`}>
      <span className={cn('inline-flex items-center gap-1.5 text-xs', meta.className)}>
        <Icon className="size-3.5 shrink-0" aria-hidden />
        <span className="font-semibold">{meta.label}</span>
        <span className="text-slate-500">· {when}</span>
      </span>
    </Tooltip>
  )
}
