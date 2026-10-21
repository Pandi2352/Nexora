import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar, IconButton, Tooltip } from '@/components/ui'
import { paths } from '@/config/paths'
import type { Ticket } from '@/types/support'
import { SlaIndicator } from '../SlaIndicator'
import { TicketPriorityBadge } from '../TicketPriorityBadge'
import { TicketStatusBadge } from '../TicketStatusBadge'
import { TicketTags } from '../TicketTags'
import { formatRelative } from '../support-formatters'
import { ACTIVE_STATUSES, CATEGORY_LABELS } from '../support-options'

interface TicketTableRowProps {
  ticket: Ticket
  slug: string
  assigneeName?: string
  canEdit: boolean
  canDelete: boolean
  onDelete: (ticket: Ticket) => void
}

export function TicketTableRow({
  ticket,
  slug,
  assigneeName,
  canEdit,
  canDelete,
  onDelete,
}: TicketTableRowProps) {
  const isActive = ACTIVE_STATUSES.includes(ticket.status)
  const detailHref = paths.supportTicket(slug, ticket.id)

  return (
    <tr className="group transition-colors hover:bg-slate-50/80">
      <td className="px-3 py-3 align-top">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-semibold text-slate-500">
            {ticket.ticketKey}
          </span>
          <span className="text-[11px] text-slate-400">·</span>
          <span className="text-[11px] text-slate-500">{CATEGORY_LABELS[ticket.category]}</span>
        </div>
        <Link
          to={detailHref}
          className="mt-0.5 block max-w-md truncate font-semibold text-slate-900 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-md"
        >
          {ticket.subject}
        </Link>
        <div className="mt-1">
          <TicketTags tags={ticket.tags} />
        </div>
      </td>
      <td className="px-3 py-3 align-top">
        <p className="truncate font-medium text-slate-800">{ticket.requester.name}</p>
        <p className="truncate text-xs text-slate-500">
          {ticket.requester.companyName || ticket.requester.email}
        </p>
      </td>
      <td className="px-3 py-3 align-top">
        <TicketPriorityBadge priority={ticket.priority} />
      </td>
      <td className="px-3 py-3 align-top">
        <TicketStatusBadge status={ticket.status} />
      </td>
      <td className="px-3 py-3 align-top">
        {assigneeName ? (
          <span className="flex items-center gap-2">
            <Avatar name={assigneeName} size="sm" />
            <span className="truncate text-slate-700">{assigneeName}</span>
          </span>
        ) : (
          <span className="text-xs font-medium text-amber-700">Unassigned</span>
        )}
      </td>
      <td className="px-3 py-3 align-top">
        {isActive || ticket.status === 'resolved' ? (
          <SlaIndicator label="Resolution" timer={ticket.sla.resolution} compact />
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </td>
      <td className="whitespace-nowrap px-3 py-3 align-top text-xs text-slate-500">
        {formatRelative(ticket.lastActivityAt)}
        {ticket.replyCount > 0 && (
          <span className="block">
            {ticket.replyCount} {ticket.replyCount === 1 ? 'reply' : 'replies'}
          </span>
        )}
      </td>
      <td className="px-3 py-3 text-right align-top">
        <div className="flex justify-end gap-0.5">
          <Tooltip content="Open ticket">
            <Link
              to={detailHref}
              aria-label={`Open ${ticket.ticketKey}`}
              className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <Eye className="size-4" />
            </Link>
          </Tooltip>
          {canEdit && (
            <Tooltip content="Edit ticket">
              <Link
                to={paths.supportTicketEdit(slug, ticket.id)}
                aria-label={`Edit ${ticket.ticketKey}`}
                className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <Pencil className="size-4" />
              </Link>
            </Tooltip>
          )}
          {canDelete && (
            <IconButton
              aria-label={`Delete ${ticket.ticketKey}`}
              size="sm"
              onClick={() => onDelete(ticket)}
              className="hover:text-rose-600"
            >
              <Trash2 className="size-4" />
            </IconButton>
          )}
        </div>
      </td>
    </tr>
  )
}
