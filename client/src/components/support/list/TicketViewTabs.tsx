import { cn } from '@/lib/cn'
import type { TicketStats, TicketView } from '@/types/support'

const TABS: Array<{ id: TicketView; label: string }> = [
  { id: 'active', label: 'Active' },
  { id: 'open', label: 'Open' },
  { id: 'in_progress', label: 'In progress' },
  { id: 'waiting_on_customer', label: 'Waiting' },
  { id: 'on_hold', label: 'On hold' },
  { id: 'resolved', label: 'Resolved' },
  { id: 'closed', label: 'Closed' },
  { id: 'all', label: 'All' },
]

interface TicketViewTabsProps {
  value: TicketView
  stats: TicketStats | null
  onChange: (view: TicketView) => void
}

export function TicketViewTabs({ value, stats, onChange }: TicketViewTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Ticket views"
      className="flex items-center gap-1.5 overflow-x-auto pb-1"
    >
      {TABS.map((tab) => {
        const selected = tab.id === value
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
              selected
                ? 'border-brand-300 bg-brand-50 font-semibold text-brand-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
            )}
          >
            {tab.label}
            <span
              className={cn(
                'rounded-full px-1.5 text-[10px]',
                selected ? 'bg-brand-100 text-brand-800' : 'bg-slate-100 text-slate-500',
              )}
            >
              {stats?.byStatus[tab.id] ?? 0}
            </span>
          </button>
        )
      })}
    </div>
  )
}
