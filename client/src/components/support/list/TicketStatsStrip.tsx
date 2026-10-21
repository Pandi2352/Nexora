import type { LucideIcon } from 'lucide-react'
import { CheckCircle2, Inbox, Timer, TriangleAlert, UserX } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { TicketStats } from '@/types/support'
import { formatDuration } from '../support-formatters'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  hint?: string
  tone: string
  onClick?: () => void
}

function StatCard({ icon: Icon, label, value, hint, tone, onClick }: StatCardProps) {
  const Wrapper = onClick ? 'button' : 'div'
  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-md border border-slate-200 bg-white p-3.5 text-left transition-colors',
        onClick &&
          'hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
      )}
    >
      <span
        className={cn('flex size-10 shrink-0 items-center justify-center rounded-md border', tone)}
      >
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-medium text-slate-500">{label}</span>
        <span className="mt-0.5 block text-xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        {hint && <span className="block truncate text-[11px] text-slate-500">{hint}</span>}
      </span>
    </Wrapper>
  )
}

interface TicketStatsStripProps {
  stats: TicketStats | null
  onShowUnassigned: () => void
  onShowBreached: () => void
}

/** Queue health at a glance. Unassigned and breached cards filter the queue. */
export function TicketStatsStrip({
  stats,
  onShowUnassigned,
  onShowBreached,
}: TicketStatsStripProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      <StatCard
        icon={Inbox}
        label="Active tickets"
        value={stats?.byStatus.active ?? '—'}
        hint={stats ? `${stats.mine} assigned to you · ${stats.urgent} urgent` : undefined}
        tone="border-brand-200 bg-brand-50 text-brand-700"
      />
      <StatCard
        icon={UserX}
        label="Unassigned"
        value={stats?.unassigned ?? '—'}
        hint="Needs an owner"
        tone="border-amber-200 bg-amber-50 text-amber-700"
        onClick={onShowUnassigned}
      />
      <StatCard
        icon={TriangleAlert}
        label="SLA breached"
        value={stats?.breached ?? '—'}
        hint="Past resolution target"
        tone="border-rose-200 bg-rose-50 text-rose-700"
        onClick={onShowBreached}
      />
      <StatCard
        icon={Timer}
        label="Avg first response"
        value={formatDuration(stats?.avgFirstResponseMinutes)}
        hint={`Avg resolution ${formatDuration(stats?.avgResolutionMinutes)} · 30 days`}
        tone="border-sky-200 bg-sky-50 text-sky-700"
      />
      <StatCard
        icon={CheckCircle2}
        label="Resolved"
        value={stats?.resolvedLast7Days ?? '—'}
        hint="Last 7 days"
        tone="border-emerald-200 bg-emerald-50 text-emerald-700"
      />
    </div>
  )
}
