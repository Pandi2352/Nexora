import { LifeBuoy, Plus, SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { Pagination, Spinner, buttonVariants } from '@/components/ui'
import { paths, workspaceSegments } from '@/config/paths'
import { resolveError } from '@/lib/errors'
import type { PaginationMeta } from '@/types/api'
import type { Ticket } from '@/types/support'
import { TicketTable } from './TicketTable'

interface TicketQueueResultsProps {
  slug: string
  tickets: Ticket[]
  meta: PaginationMeta | null
  error: unknown
  isLoading: boolean
  isFiltered: boolean
  nameById: Map<string, string>
  canEdit: boolean
  canDelete: boolean
  onDelete: (ticket: Ticket) => void
  onRetry: () => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

/** Loading, error, empty and table states of the ticket queue. */
export function TicketQueueResults(props: TicketQueueResultsProps) {
  const { tickets, meta } = props

  if (props.error && tickets.length === 0) {
    return <ErrorState error={resolveError(props.error)} onRetry={props.onRetry} />
  }
  if (props.isLoading && tickets.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-md border border-slate-200 bg-white">
        <Spinner size="lg" label="Loading tickets..." />
      </div>
    )
  }
  if (tickets.length === 0) {
    return props.isFiltered ? (
      <EmptyState
        icon={SearchX}
        title="No tickets match these filters"
        description="Try another view, or reset the filters."
      />
    ) : (
      <EmptyState
        icon={LifeBuoy}
        title="No support tickets yet"
        description="Log customer requests here to track SLAs, replies and resolutions in one place."
        action={
          props.canEdit && (
            <Link
              to={paths.workspace(props.slug, workspaceSegments.supportTicketNew)}
              className={buttonVariants({ variant: 'primary' })}
            >
              <Plus className="size-4" aria-hidden />
              New ticket
            </Link>
          )
        }
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <TicketTable
        tickets={tickets}
        slug={props.slug}
        nameById={props.nameById}
        canEdit={props.canEdit}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
      />
      {meta && meta.total > 0 && (
        <div className="border-t border-slate-200 bg-slate-50/50 px-4 py-3">
          <Pagination
            currentPage={meta.page}
            totalPages={Math.max(1, meta.totalPages)}
            totalItems={meta.total}
            pageSize={meta.limit}
            onPageChange={props.onPageChange}
            onPageSizeChange={props.onPageSizeChange}
          />
        </div>
      )}
    </div>
  )
}
