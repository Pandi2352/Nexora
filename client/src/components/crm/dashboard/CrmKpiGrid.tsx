import { Building2, DollarSign, Target, TrendingUp, Users, Zap } from 'lucide-react'
import { formatINR } from '../crm-formatters'

interface CrmKpiGridProps {
  pipelineValueINR: number
  closedWonINR: number
  activeDealsCount: number
  qualifiedLeadsCount: number
  totalCompaniesCount: number
  totalActivitiesCount: number
}

export function CrmKpiGrid({
  pipelineValueINR,
  closedWonINR,
  activeDealsCount,
  qualifiedLeadsCount,
  totalCompaniesCount,
  totalActivitiesCount,
}: CrmKpiGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1. Pipeline Value */}
      <div className="rounded-md border border-indigo-200 bg-gradient-to-br from-indigo-50/60 to-white p-3.5 space-y-1">
        <div className="flex items-center justify-between text-indigo-700">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Pipeline</span>
          <DollarSign className="size-4" />
        </div>
        <p className="text-lg sm:text-xl font-bold text-indigo-950 font-mono">
          {formatINR(pipelineValueINR)}
        </p>
        <p className="text-[10px] text-indigo-600 font-medium">Weighted Target</p>
      </div>

      {/* 2. Closed Won */}
      <div className="rounded-md border border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-white p-3.5 space-y-1">
        <div className="flex items-center justify-between text-emerald-700">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Closed Won</span>
          <TrendingUp className="size-4" />
        </div>
        <p className="text-lg sm:text-xl font-bold text-emerald-950 font-mono">
          {formatINR(closedWonINR)}
        </p>
        <p className="text-[10px] text-emerald-600 font-medium">Booked Revenue</p>
      </div>

      {/* 3. Active Deals */}
      <div className="rounded-md border border-slate-200 bg-white p-3.5 space-y-1">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Active Deals</span>
          <Target className="size-4 text-brand-600" />
        </div>
        <p className="text-lg sm:text-xl font-bold text-slate-900 font-mono">
          {activeDealsCount}
        </p>
        <p className="text-[10px] text-slate-500">In Pipeline</p>
      </div>

      {/* 4. Qualified Leads */}
      <div className="rounded-md border border-slate-200 bg-white p-3.5 space-y-1">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Qualified Leads</span>
          <Users className="size-4 text-purple-600" />
        </div>
        <p className="text-lg sm:text-xl font-bold text-slate-900 font-mono">
          {qualifiedLeadsCount}
        </p>
        <p className="text-[10px] text-slate-500">Vetted Prospects</p>
      </div>

      {/* 5. Total Companies */}
      <div className="rounded-md border border-slate-200 bg-white p-3.5 space-y-1">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Accounts</span>
          <Building2 className="size-4 text-sky-600" />
        </div>
        <p className="text-lg sm:text-xl font-bold text-slate-900 font-mono">
          {totalCompaniesCount}
        </p>
        <p className="text-[10px] text-slate-500">Company Master</p>
      </div>

      {/* 6. Activities Logged */}
      <div className="rounded-md border border-slate-200 bg-white p-3.5 space-y-1">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Touches</span>
          <Zap className="size-4 text-amber-500" />
        </div>
        <p className="text-lg sm:text-xl font-bold text-slate-900 font-mono">
          {totalActivitiesCount}
        </p>
        <p className="text-[10px] text-slate-500">Sales Activities</p>
      </div>
    </div>
  )
}
