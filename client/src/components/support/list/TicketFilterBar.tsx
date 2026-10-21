import { RefreshCw, RotateCcw, TriangleAlert } from 'lucide-react'
import { Button, IconButton, SearchInput, Select, type SelectOption } from '@/components/ui'
import type { TicketFilterKey } from '@/hooks/useTicketList'
import { cn } from '@/lib/cn'
import type { TicketListParams } from '@/types/support'
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS } from '../support-options'

const SORT_OPTIONS: SelectOption[] = [
  { value: 'lastActivityAt:desc', label: 'Recently active' },
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'createdAt:asc', label: 'Oldest first' },
  { value: 'priorityRank:desc', label: 'Highest priority' },
  { value: 'resolutionDueAt:asc', label: 'Due soonest' },
  { value: 'ticketNumber:desc', label: 'Ticket number' },
]

interface TicketFilterBarProps {
  query: TicketListParams
  searchDraft: string
  onSearchChange: (value: string) => void
  memberOptions: SelectOption[]
  onChange: (changes: Partial<Record<TicketFilterKey, string | undefined>>) => void
  isFiltered: boolean
  onReset: () => void
  onRefresh: () => void
  isRefreshing: boolean
}

export function TicketFilterBar(props: TicketFilterBarProps) {
  const { query, onChange } = props
  const assigneeOptions: SelectOption[] = [
    { value: 'me', label: 'Assigned to me' },
    { value: 'unassigned', label: 'Unassigned' },
    ...props.memberOptions,
  ]
  const breached = query.sla === 'breached'

  return (
    <div className="flex flex-col gap-2 rounded-md border border-slate-200 bg-white p-3 lg:flex-row lg:items-center">
      <div className="w-full lg:w-72">
        <SearchInput
          placeholder="Search tickets or TCK-12"
          value={props.searchDraft}
          onChange={(e) => props.onSearchChange(e.target.value)}
          onClear={() => props.onSearchChange('')}
        />
      </div>
      <div className="grid flex-1 grid-cols-2 gap-2 md:grid-cols-4">
        <Select
          placeholder="Any priority"
          options={PRIORITY_OPTIONS}
          value={query.priority}
          clearable
          onChange={(value) => onChange({ priority: value })}
        />
        <Select
          placeholder="Any category"
          options={CATEGORY_OPTIONS}
          value={query.category}
          clearable
          onChange={(value) => onChange({ category: value })}
        />
        <Select
          placeholder="Any assignee"
          options={assigneeOptions}
          value={query.assignee}
          clearable
          searchable
          onChange={(value) => onChange({ assignee: value })}
        />
        <Select
          options={SORT_OPTIONS}
          value={`${query.sort}:${query.order}`}
          onChange={(value) => {
            const [sort, order] = value.split(':')
            onChange({ sort, order })
          }}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          aria-pressed={breached}
          onClick={() => onChange({ sla: breached ? undefined : 'breached' })}
          className={cn(breached && 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-50')}
        >
          <TriangleAlert className="size-4" aria-hidden />
          Breached
        </Button>
        {props.isFiltered && (
          <Button variant="ghost" onClick={props.onReset}>
            <RotateCcw className="size-4" aria-hidden />
            Reset
          </Button>
        )}
        <IconButton
          aria-label="Refresh tickets"
          onClick={props.onRefresh}
          disabled={props.isRefreshing}
        >
          <RefreshCw className={cn('size-4', props.isRefreshing && 'animate-spin')} />
        </IconButton>
      </div>
    </div>
  )
}
