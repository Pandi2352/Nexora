import { Building2, CheckCircle2, TrendingUp, Users } from 'lucide-react'
import type { Company } from '@/types/crm'

interface CompanyStatsStripProps {
  companies: Company[]
}

export function CompanyStatsStrip({ companies }: CompanyStatsStripProps) {
  const total = companies.length
  const customers = companies.filter((c) => c.status === 'customer').length
  const prospects = companies.filter((c) => c.status === 'prospect').length
  const totalRevenue = companies.reduce((acc, c) => acc + (c.annualRevenue || 0), 0)

  const formatCurrency = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(1)} Cr`
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)} L`
    }
    return `₹${val.toLocaleString('en-IN')}`
  }

  const stats = [
    {
      label: 'Total Accounts',
      value: total,
      subtext: 'Client & partner directory',
      icon: Building2,
      color: 'bg-brand-50 text-brand-600 border-brand-200',
    },
    {
      label: 'Active Customers',
      value: customers,
      subtext: `${total > 0 ? Math.round((customers / total) * 100) : 0}% portfolio ratio`,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      label: 'Prospect Pipeline',
      value: prospects,
      subtext: 'High-intent enterprise deals',
      icon: Users,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
      label: 'Tracked Revenue',
      value: formatCurrency(totalRevenue),
      subtext: 'Cumulative annual turnover',
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
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
