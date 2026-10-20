import {
  CheckCircle2,
  LayoutGrid,
  MinusCircle,
  RefreshCw,
  RotateCcw,
  Star,
} from 'lucide-react'
import { SearchInput, Tooltip } from '@/components/ui'

export interface BusinessUnitFilterBarProps {
  search: string
  onSearchChange: (val: string) => void
  statusFilter: string
  onStatusChange: (val: string) => void
  statusCounts: {
    all: number
    active: number
    inactive: number
    default: number
  }
  onRefresh?: () => void
  isRefreshing?: boolean
}

export function BusinessUnitFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  statusCounts,
  onRefresh,
  isRefreshing = false,
}: BusinessUnitFilterBarProps) {
  const isFiltered = search || statusFilter !== 'all'

  const statusTabs = [
    {
      key: 'all',
      label: 'All Units',
      count: statusCounts.all,
      icon: LayoutGrid,
      accent: 'text-slate-500',
    },
    {
      key: 'active',
      label: 'Active',
      count: statusCounts.active,
      icon: CheckCircle2,
      accent: 'text-emerald-500',
    },
    {
      key: 'inactive',
      label: 'Inactive',
      count: statusCounts.inactive,
      icon: MinusCircle,
      accent: 'text-slate-400',
    },
    {
      key: 'default',
      label: 'Default',
      count: statusCounts.default,
      icon: Star,
      accent: 'text-amber-500',
    },
  ]

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
      {/* Left side: Modern Styled Status Tabs with Light Brand Theme */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/90 rounded-md border border-slate-200/90 w-fit shrink-0">
        {statusTabs.map((tab) => {
          const isActive = statusFilter === tab.key
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onStatusChange(tab.key)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border transition-all cursor-pointer select-none ${
                isActive
                  ? 'bg-brand-50 text-brand-700 border-brand-300 font-semibold shadow-none'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Icon className={`size-3.5 ${isActive ? 'text-brand-600' : tab.accent}`} />
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 text-[10px] rounded-md font-mono font-semibold ${
                  isActive
                    ? 'bg-brand-100 text-brand-800 border border-brand-200/80'
                    : 'bg-slate-200/80 text-slate-700 border border-transparent'
                }`}
              >
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Right side: Search, Reset and Refresh Button */}
      <div className="flex flex-wrap items-center gap-2.5 justify-start lg:justify-end">
        <div className="w-full sm:w-72 md:w-80">
          <SearchInput
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by unit name or code..."
            size="md"
          />
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={() => {
              onSearchChange('')
              onStatusChange('all')
            }}
            className="inline-flex items-center gap-1.5 h-10 px-3 text-xs font-medium text-slate-600 hover:text-rose-600 rounded-md border border-slate-200 hover:border-rose-200 bg-white hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
            title="Reset filters"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset</span>
          </button>
        )}

        {onRefresh && (
          <Tooltip content="Refresh table" placement="top">
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center size-10 text-slate-600 hover:text-brand-600 rounded-md border border-slate-200 hover:border-brand-300 bg-white hover:bg-brand-50/50 transition-colors cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Refresh table"
            >
              <RefreshCw className={`size-4 ${isRefreshing ? 'animate-spin text-brand-600' : ''}`} />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  )
}
