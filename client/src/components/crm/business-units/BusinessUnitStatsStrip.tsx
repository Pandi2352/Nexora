import { CheckCircle2, Layers, MinusCircle, Star } from 'lucide-react'
import type { BusinessUnitItem } from '@/types/crm'

interface BusinessUnitStatsStripProps {
  units: BusinessUnitItem[]
}

export function BusinessUnitStatsStrip({ units }: BusinessUnitStatsStripProps) {
  const total = units.length
  const active = units.filter((u) => u.isActive).length
  const inactive = units.filter((u) => !u.isActive).length
  const defaultUnit = units.find((u) => u.isDefault)

  const stats = [
    {
      label: 'Total Business Units',
      value: total,
      subtext: 'Operational divisions directory',
      icon: Layers,
      color: 'bg-brand-50 text-brand-600 border-brand-200',
    },
    {
      label: 'Active Divisions',
      value: active,
      subtext: `${total > 0 ? Math.round((active / total) * 100) : 0}% operational ratio`,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      label: 'Inactive Units',
      value: inactive,
      subtext: 'Archived or pending setups',
      icon: MinusCircle,
      color: 'bg-slate-100 text-slate-600 border-slate-200',
    },
    {
      label: 'Default Division',
      value: defaultUnit ? defaultUnit.code : 'None',
      subtext: defaultUnit ? defaultUnit.name : 'Fallback assignment unit',
      icon: Star,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="flex items-center gap-3.5 p-3.5 rounded-md border border-slate-200/80 bg-white hover:border-slate-300 transition-colors"
          >
            <div
              className={`flex size-10 items-center justify-center rounded-md border shrink-0 ${stat.color}`}
            >
              <Icon className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider truncate">
                {stat.label}
              </p>
              <p className="text-lg font-bold text-slate-900 tracking-tight leading-none mt-1">
                {stat.value}
              </p>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{stat.subtext}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
