import type { CompanyStatus } from '@/types/crm'

interface CompanyStatusBadgeProps {
  status: CompanyStatus
}

const statusConfigs: Record<
  CompanyStatus,
  { label: string; dot: string; container: string }
> = {
  customer: {
    label: 'Customer',
    dot: 'bg-emerald-500',
    container: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  },
  prospect: {
    label: 'Prospect',
    dot: 'bg-amber-500',
    container: 'bg-amber-50 text-amber-700 border-amber-200/80',
  },
  partner: {
    label: 'Partner',
    dot: 'bg-indigo-500',
    container: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
  },
  inactive: {
    label: 'Inactive',
    dot: 'bg-slate-400',
    container: 'bg-slate-100 text-slate-600 border-slate-200/80',
  },
}

export function CompanyStatusBadge({ status }: CompanyStatusBadgeProps) {
  const config = statusConfigs[status] || statusConfigs.inactive

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-md border ${config.container}`}
    >
      <span className={`size-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  )
}
