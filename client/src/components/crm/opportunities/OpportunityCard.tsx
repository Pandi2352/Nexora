import { ArrowLeft, ArrowRight, Building2, Calendar, Pencil, Star, Trash2 } from 'lucide-react'
import { Tooltip } from '@/components/ui'
import type { Opportunity, OpportunityStage } from '@/types/crm'
import { QuotationStatusBadge } from './OpportunityStageBadge'
import { formatDateSafe, formatINR } from '../crm-formatters'

interface OpportunityCardProps {
  opportunity: Opportunity
  stages: { key: OpportunityStage; label: string }[]
  onEdit: (opp: Opportunity) => void
  onMoveStage: (oppId: string, nextStage: OpportunityStage) => void
  onDelete: (oppId: string) => void
}

export function OpportunityCard({
  opportunity,
  stages,
  onEdit,
  onMoveStage,
  onDelete,
}: OpportunityCardProps) {
  const currentIndex = stages.findIndex((s) => s.key === opportunity.stage)
  const prevStage = currentIndex > 0 ? stages[currentIndex - 1] : null
  const nextStage = currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null

  return (
    <div className="rounded-md border border-slate-200 bg-white p-3 space-y-2.5 transition-colors hover:border-slate-300">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-slate-900 text-sm truncate">
              {opportunity.title}
            </span>
            {opportunity.isMustWin && (
              <span title="Must Win Deal">
                <Star className="size-3.5 fill-amber-500 text-amber-500 shrink-0" />
              </span>
            )}
          </div>
          {opportunity.companyName && (
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5 truncate">
              <Building2 className="size-3 shrink-0" />
              <span>{opportunity.companyName}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Tooltip content="Edit Deal">
            <button
              type="button"
              onClick={() => onEdit(opportunity)}
              className="size-6.5 flex items-center justify-center rounded-md border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 hover:text-sky-800 transition-colors cursor-pointer"
              aria-label="Edit deal"
            >
              <Pencil className="size-3" />
            </button>
          </Tooltip>
          <Tooltip content="Delete Deal">
            <button
              type="button"
              onClick={() => onDelete(opportunity.id)}
              className="size-6.5 flex items-center justify-center rounded-md border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 transition-colors cursor-pointer"
              aria-label="Delete deal"
            >
              <Trash2 className="size-3" />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <span className="text-base font-bold text-slate-900">
          {formatINR(opportunity.value)}
        </span>
        <span className="text-xs text-slate-500 font-medium">
          {opportunity.probability}% prob.
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <QuotationStatusBadge status={opportunity.quotationStatus} />
        {opportunity.expectedCloseDate && (
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
            <Calendar className="size-3" />
            {formatDateSafe(opportunity.expectedCloseDate)}
          </span>
        )}
      </div>

      {/* Stage Progression Quick-controls */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[11px]">
        {prevStage ? (
          <button
            type="button"
            onClick={() => onMoveStage(opportunity.id, prevStage.key)}
            className="flex items-center gap-1 text-slate-500 hover:text-brand-600 transition-colors cursor-pointer"
            title={`Move back to ${prevStage.label}`}
          >
            <ArrowLeft className="size-3" />
            <span>{prevStage.label}</span>
          </button>
        ) : (
          <span />
        )}

        {nextStage && (
          <button
            type="button"
            onClick={() => onMoveStage(opportunity.id, nextStage.key)}
            className="flex items-center gap-1 font-medium text-brand-600 hover:text-brand-700 transition-colors cursor-pointer"
            title={`Advance to ${nextStage.label}`}
          >
            <span>{nextStage.label}</span>
            <ArrowRight className="size-3" />
          </button>
        )}
      </div>
    </div>
  )
}
