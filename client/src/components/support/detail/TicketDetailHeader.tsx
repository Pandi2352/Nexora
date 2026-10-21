import { ArrowLeft, Copy, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, IconButton, Tooltip, buttonVariants, toast } from '@/components/ui'
import { paths, workspaceSegments } from '@/config/paths'
import type { Ticket } from '@/types/support'
import { TicketPriorityBadge } from '../TicketPriorityBadge'
import { TicketStatusBadge } from '../TicketStatusBadge'
import { formatDateTime } from '../support-formatters'
import { CATEGORY_LABELS, CHANNEL_LABELS } from '../support-options'

interface TicketDetailHeaderProps {
  ticket: Ticket
  slug: string
  canEdit: boolean
  canDelete: boolean
  onDelete: () => void
}

export function TicketDetailHeader({
  ticket,
  slug,
  canEdit,
  canDelete,
  onDelete,
}: TicketDetailHeaderProps) {
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Ticket link copied')
    } catch {
      toast.error('Could not copy the link')
    }
  }

  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <Link
          to={paths.workspace(slug, workspaceSegments.supportTickets)}
          aria-label="Back to tickets"
          className="flex size-9 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="min-w-0">
          <p className="font-mono text-xs font-semibold text-slate-500">
            {ticket.ticketKey}
            <span className="font-sans font-normal">
              {' '}
              · {CATEGORY_LABELS[ticket.category]} · via {CHANNEL_LABELS[ticket.channel]} · opened{' '}
              {formatDateTime(ticket.createdAt)}
            </span>
          </p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 break-words">
            {ticket.subject}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <TicketStatusBadge status={ticket.status} />
            <TicketPriorityBadge priority={ticket.priority} />
            {ticket.reopenCount > 0 && (
              <span className="text-xs font-medium text-amber-700">
                Reopened {ticket.reopenCount}×
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 self-end lg:self-auto">
        <Tooltip content="Copy link">
          <IconButton aria-label="Copy ticket link" onClick={copyLink}>
            <Copy className="size-4" />
          </IconButton>
        </Tooltip>
        {canDelete && (
          <Button variant="outline" onClick={onDelete} className="text-rose-700 hover:bg-rose-50">
            <Trash2 className="size-4" aria-hidden />
            Delete
          </Button>
        )}
        {canEdit && ticket.status !== 'closed' && (
          <Link
            to={paths.supportTicketEdit(slug, ticket.id)}
            className={buttonVariants({ variant: 'primary' })}
          >
            <Pencil className="size-4" aria-hidden />
            Edit details
          </Link>
        )}
      </div>
    </div>
  )
}
