import { useState } from 'react'
import type { Opportunity, OpportunityStage } from '@/types/crm'
import { OpportunityCard } from './OpportunityCard'
import { formatINR } from '../crm-formatters'

interface PipelineKanbanProps {
  opportunities: Opportunity[]
  onEdit: (opp: Opportunity) => void
  onMoveStage: (oppId: string, nextStage: OpportunityStage) => void
  onDelete: (oppId: string) => void
}

export const STAGES: { key: OpportunityStage; label: string; accentColor: string }[] = [
  { key: 'qualification', label: 'Qualification', accentColor: 'bg-slate-400' },
  { key: 'needs_analysis', label: 'Needs Analysis', accentColor: 'bg-blue-500' },
  { key: 'proposal_quote', label: 'Proposal / Quote', accentColor: 'bg-amber-500' },
  { key: 'negotiation', label: 'Negotiation', accentColor: 'bg-purple-500' },
  { key: 'closed_won', label: 'Closed Won', accentColor: 'bg-emerald-500' },
  { key: 'closed_lost', label: 'Closed Lost', accentColor: 'bg-rose-500' },
]

export function PipelineKanban({
  opportunities,
  onEdit,
  onMoveStage,
  onDelete,
}: PipelineKanbanProps) {
  const [dragOverStage, setDragOverStage] = useState<OpportunityStage | null>(null)

  const handleDragOver = (e: React.DragEvent, stageKey: OpportunityStage) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverStage !== stageKey) {
      setDragOverStage(stageKey)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverStage(null)
    }
  }

  const handleDrop = (e: React.DragEvent, stageKey: OpportunityStage) => {
    e.preventDefault()
    setDragOverStage(null)
    const oppId = e.dataTransfer.getData('text/plain')
    if (oppId) {
      onMoveStage(oppId, stageKey)
    }
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
      {STAGES.map((stage) => {
        const stageOpps = opportunities.filter((o) => o.stage === stage.key)
        const stageValue = stageOpps.reduce((sum, o) => sum + (o.value || 0), 0)
        const isColumnActive = dragOverStage === stage.key

        return (
          <div
            key={stage.key}
            onDragOver={(e) => handleDragOver(e, stage.key)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage.key)}
            className={`flex flex-col w-72 shrink-0 rounded-md border p-3 transition-colors duration-150 ${
              isColumnActive
                ? 'border-brand-500 bg-brand-50/40 ring-2 ring-brand-500/20'
                : 'border-slate-200 bg-slate-50/60'
            }`}
          >
            {/* Column Header */}
            <div className="mb-3 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${stage.accentColor}`} />
                  <span className="font-semibold text-xs text-slate-800">{stage.label}</span>
                </div>
                <span className="rounded-md bg-white border border-slate-200 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">
                  {stageOpps.length}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-900">
                {formatINR(stageValue)}
              </p>
            </div>

            {/* Column Content & Drop Zone */}
            <div className="space-y-2.5 min-h-[160px] flex-1 overflow-y-auto">
              {isColumnActive && (
                <div className="flex h-12 items-center justify-center rounded-md border-2 border-dashed border-brand-400 bg-brand-50/80 text-xs font-semibold text-brand-700 animate-pulse">
                  Drop deal here → {stage.label}
                </div>
              )}

              {stageOpps.length === 0 && !isColumnActive ? (
                <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-slate-200 text-xs text-slate-400">
                  No deals
                </div>
              ) : (
                stageOpps.map((opp) => (
                  <OpportunityCard
                    key={opp.id || (opp as any)._id}
                    opportunity={opp}
                    stages={STAGES}
                    onEdit={onEdit}
                    onMoveStage={onMoveStage}
                    onDelete={onDelete}
                  />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
