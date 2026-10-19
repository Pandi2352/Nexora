import { Building2, Calendar, Trash2 } from 'lucide-react'
import type { Company, SalesActivity } from '@/types/crm'
import { ActivityOutcomeBadge, ActivityTypeBadge } from './ActivityTypeBadge'
import { formatDateSafe, formatINR } from '../crm-formatters'

interface ActivityTimelineProps {
  activities: SalesActivity[]
  companies: Company[]
  onDelete?: (activityId: string) => void
}

export function ActivityTimeline({
  activities,
  companies,
  onDelete,
}: ActivityTimelineProps) {
  const companyMap = new Map(companies.map((c) => [c.id, c.name]))

  return (
    <div className="space-y-3">
      {activities.map((act) => {
        const companyName = act.companyId ? companyMap.get(act.companyId) : null
        const dateStr = act.completedAt || act.scheduledAt || act.createdAt

        return (
          <div
            key={act.id}
            className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 rounded-md border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <ActivityTypeBadge type={act.type} />
                <span className="font-semibold text-slate-900 text-sm">{act.title}</span>
                {companyName && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                    <Building2 className="size-3 text-slate-500" />
                    {companyName}
                  </span>
                )}
                <ActivityOutcomeBadge outcome={act.outcome} />
              </div>

              {act.description && (
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  {act.description}
                </p>
              )}

              {act.proposalValue !== undefined && act.proposalValue > 0 && (
                <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                  <span>Proposal Quoted:</span>
                  <span>{formatINR(act.proposalValue)}</span>
                </div>
              )}
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {formatDateSafe(dateStr)}
              </span>

              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(act.id)}
                  title="Delete activity"
                  className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
