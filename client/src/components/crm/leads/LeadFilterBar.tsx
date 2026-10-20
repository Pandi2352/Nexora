import {
  CheckCircle2,
  FileText,
  MessageSquare,
  MinusCircle,
  PhoneCall,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Star,
} from 'lucide-react'
import { SearchInput, Tooltip } from '@/components/ui'

export interface LeadStatusCounts {
  all: number
  new: number
  contacted: number
  in_discussion: number
  qualified: number
  proposal_sent: number
  unqualified: number
}

interface LeadFilterBarProps {
  search: string
  onSearchChange: (val: string) => void
  statusFilter: string
  onStatusChange: (val: string) => void
  mustWinOnly: boolean
  onMustWinChange: (val: boolean) => void
  statusCounts: LeadStatusCounts
  onRefresh?: () => void
  isRefreshing?: boolean
}

const TABS: Array<{ id: string; label: string; icon: any }> = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'new', label: 'New', icon: Sparkles },
  { id: 'contacted', label: 'Contacted', icon: PhoneCall },
  { id: 'in_discussion', label: 'In Discussion', icon: MessageSquare },
  { id: 'qualified', label: 'Qualified', icon: CheckCircle2 },
  { id: 'proposal_sent', label: 'Proposal Sent', icon: FileText },
  { id: 'unqualified', label: 'Unqualified', icon: MinusCircle },
]

export function LeadFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  mustWinOnly,
  onMustWinChange,
  statusCounts,
  onRefresh,
  isRefreshing,
}: LeadFilterBarProps) {
  const isFiltered = search.trim() !== '' || statusFilter !== 'all' || mustWinOnly

  const handleReset = () => {
    onSearchChange('')
    onStatusChange('all')
    onMustWinChange(false)
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Status Tabs with Light Brand Active Style */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
        {TABS.map((tab) => {
          const isActive = statusFilter === tab.id
          const count = (statusCounts as any)[tab.id] ?? 0
          const Icon = tab.icon

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onStatusChange(tab.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-md border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'border-brand-300 bg-brand-50 text-brand-700 font-semibold'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Icon className="size-3.5 opacity-70" />
              <span>{tab.label}</span>
              <span
                className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] ${
                  isActive
                    ? 'bg-brand-100 text-brand-800'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Right Controls: Search + MustWin + Reset + Refresh */}
      <div className="flex items-center gap-2">
        <div className="w-full sm:w-64">
          <SearchInput
            placeholder="Search leads, contacts, BU..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Must-Win Strategic Filter */}
        <button
          type="button"
          onClick={() => onMustWinChange(!mustWinOnly)}
          className={`flex h-10 items-center gap-1.5 px-3 rounded-md border text-xs font-medium transition-colors cursor-pointer shrink-0 ${
            mustWinOnly
              ? 'border-amber-300 bg-amber-50 text-amber-800 font-semibold'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Star
            className={`size-3.5 ${
              mustWinOnly ? 'fill-amber-500 text-amber-500' : 'text-slate-400'
            }`}
          />
          <span className="hidden sm:inline">Must Win</span>
        </button>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            type="button"
            onClick={handleReset}
            className="flex h-10 items-center gap-1 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="size-3.5 text-slate-400" />
            <span>Reset</span>
          </button>
        )}

        {/* Refresh Table Button with Arrow Tooltip */}
        {onRefresh && (
          <Tooltip content="Refresh leads table">
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex size-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              aria-label="Refresh table"
            >
              <RefreshCw
                className={`size-4 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  )
}
