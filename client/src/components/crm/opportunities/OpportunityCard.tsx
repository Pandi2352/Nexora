import { useState } from 'react'
import { ArrowLeft, ArrowRight, Building2, Calendar, GripVertical, Pencil, Star, Trash2 } from 'lucide-react'
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
  const [isDragging, setIsDragging] = useState(false)
  const oppId = opportunity.id || (opportunity as any)._id
  const currentIndex = stages.findIndex((s) => s.key === opportunity.stage)
  const prevStage = currentIndex > 0 ? stages[currentIndex - 1] : null
  const nextStage = currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null

  return (
    <div
      draggable
      onDragStart={(e) => {
        setIsDragging(true)
        e.dataTransfer.setData('text/plain', oppId)
        e.dataTransfer.effectAllowed = 'move'
      }}
      onDragEnd={() => setIsDragging(false)}
      className={`rounded-md border bg-white p-3 space-y-2.5 transition-all select-none cursor-grab active:cursor-grabbing ${
        isDragging
          ? 'opacity-40 border-dashed border-brand-400 scale-[0.98]'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-none'
      }`}
    >
      <div className="flex items-start justify-between gap-1.5">
        <div className="flex items-start gap-1.5 min-w-0">
          <GripVertical className="size-3.5 text-slate-300 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
                {opportunity.title}
              </span>
              {opportunity.isMustWin && (
                <span title="Must Win Deal">
                  <Star className="size-3.5 fill-amber-500 text-amber-500 shrink-0" />
                </span>
              )}
            </div>
            {opportunity.companyName && (
              <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 truncate">
                <Building2 className="size-3 shrink-0" />
                <span>{opportunity.companyName}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Tooltip content="Edit Deal">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onEdit({ ...opportunity, id: oppId })
              }}
              className="size-6 flex items-center justify-center rounded-md border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 hover:text-sky-800 transition-colors cursor-pointer"
              aria-label="Edit deal"
            >
              <Pencil className="size-3" />
            </button>
          </Tooltip>
          <Tooltip content="Delete Deal">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(oppId)
              }}
              className="size-6 flex items-center justify-center rounded-md border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 transition-colors cursor-pointer"
              aria-label="Delete deal"
            >
              <Trash2 className="size-3" />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="flex items-baseline justify-between pt-0.5">
        <span className="text-sm font-bold text-slate-900">
          {formatINR(opportunity.value)}
        </span>
        <span className="text-[11px] text-slate-500 font-medium">
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
            onClick={(e) => {
              e.stopPropagation()
              onMoveStage(oppId, prevStage.key)
            }}
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
            onClick={(e) => {
              e.stopPropagation()
              onMoveStage(oppId, nextStage.key)
            }}
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
