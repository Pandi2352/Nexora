import { Layers, Star, TrendingUp } from 'lucide-react'
import type { Lead } from '@/types/crm'
import { formatINR } from '../crm-formatters'

interface LeadStatsStripProps {
  leads: Lead[]
}

export function LeadStatsStrip({ leads }: LeadStatsStripProps) {
  const total = leads.length
  const mustWin = leads.filter((l) => l.isMustWin).length
  const qualified = leads.filter(
    (l) => l.status === 'qualified' || l.status === 'proposal_sent',
  ).length
  const totalTargetINR = leads.reduce(
    (sum, l) => sum + (l.annualRevenueTarget || 0),
    0,
  )

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {/* Total Leads */}
      <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-white p-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-700">
          <Layers className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500 truncate">Total Leads</p>
          <p className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">{total}</p>
        </div>
      </div>

      {/* Must-Win Strategic Deals */}
      <div className="flex items-center gap-3 rounded-md border border-amber-200 bg-amber-50/50 p-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-amber-300 bg-amber-100 text-amber-700">
          <Star className="size-5 fill-amber-500 text-amber-600" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-amber-800 truncate">Must-Win Deals</p>
          <p className="text-xl font-bold tracking-tight text-amber-900 mt-0.5">{mustWin}</p>
        </div>
      </div>

      {/* Qualified / Proposal Stage */}
      <div className="flex items-center gap-3 rounded-md border border-emerald-200 bg-emerald-50/40 p-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-emerald-200 bg-emerald-100 text-emerald-700">
          <TrendingUp className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-emerald-800 truncate">Qualified Deals</p>
          <p className="text-xl font-bold tracking-tight text-emerald-900 mt-0.5">{qualified}</p>
        </div>
      </div>

      {/* Total Pipeline Target in INR */}
      <div className="flex items-center gap-3 rounded-md border border-blue-200 bg-blue-50/40 p-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-blue-200 bg-blue-100 text-blue-700">
          <span className="text-base font-black">₹</span>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-blue-800 truncate">Pipeline Value (₹)</p>
          <p className="text-lg font-bold tracking-tight text-blue-950 mt-0.5 truncate">
            {formatINR(totalTargetINR)}
          </p>
        </div>
      </div>
    </div>
  )
}
