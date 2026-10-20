import { Link } from 'react-router-dom'
import { ArrowRight, Star } from 'lucide-react'
import type { Opportunity } from '@/types/crm'
import { paths, workspaceSegments } from '@/config/paths'
import { formatINR } from '../crm-formatters'

interface RecentDealsWidgetProps {
  slug: string
  deals: Opportunity[]
}

const STAGE_LABELS: Record<string, string> = {
  qualification: 'Qualification',
  needs_analysis: 'Needs Analysis',
  proposal_quote: 'Proposal / Quote',
  negotiation: 'Negotiation',
  closed_won: 'Closed Won',
  closed_lost: 'Closed Lost',
}

const STAGE_STYLES: Record<string, string> = {
  qualification: 'bg-slate-100 text-slate-700 border-slate-200',
  needs_analysis: 'bg-blue-50 text-blue-700 border-blue-200',
  proposal_quote: 'bg-amber-50 text-amber-700 border-amber-200',
  negotiation: 'bg-purple-50 text-purple-700 border-purple-200',
  closed_won: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  closed_lost: 'bg-rose-50 text-rose-700 border-rose-200',
}

export function RecentDealsWidget({ slug, deals }: RecentDealsWidgetProps) {
  const topDeals = deals.slice(0, 5)

  return (
    <div className="rounded-md border border-slate-200 bg-white p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">High-Impact Pipeline Deals</h3>
          <p className="text-xs text-slate-500">Top opportunities requiring executive alignment</p>
        </div>
        <Link
          to={paths.workspace(slug, workspaceSegments.crmOpportunities)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
        >
          View Kanban
          <ArrowRight className="size-3" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {topDeals.map((deal) => {
          const stageStyle = STAGE_STYLES[deal.stage] || 'bg-slate-100 text-slate-700 border-slate-200'
          const stageLabel = STAGE_LABELS[deal.stage] || deal.stage

          return (
            <div key={deal.id || (deal as any)._id} className="flex items-center justify-between py-2.5 gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-slate-900 truncate">
                    {deal.title}
                  </span>
                  {deal.isMustWin && (
                    <span title="Must Win Deal">
                      <Star className="size-3 fill-amber-500 text-amber-500 shrink-0" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                  {deal.companyName || 'Unassigned Account'}
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 text-right">
                <span
                  className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-md border ${stageStyle}`}
                >
                  {stageLabel}
                </span>
                <span className="text-xs font-bold text-slate-900 font-mono">
                  {formatINR(deal.value)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
