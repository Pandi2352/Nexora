import type { Ticket } from '@/types/support'
import { TicketTableRow } from './TicketTableRow'

interface TicketTableProps {
  tickets: Ticket[]
  slug: string
  nameById: Map<string, string>
  canEdit: boolean
  canDelete: boolean
  onDelete: (ticket: Ticket) => void
}

const COLUMNS = ['Ticket', 'Requester', 'Priority', 'Status', 'Assignee', 'SLA', 'Last activity']

export function TicketTable({
  tickets,
  slug,
  nameById,
  canEdit,
  canDelete,
  onDelete,
}: TicketTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
          <tr>
            {COLUMNS.map((column) => (
              <th key={column} scope="col" className="whitespace-nowrap px-3 py-3">
                {column}
              </th>
            ))}
            <th scope="col" className="px-3 py-3 text-right">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tickets.map((ticket) => (
            <TicketTableRow
              key={ticket.id}
              ticket={ticket}
              slug={slug}
              assigneeName={
                ticket.assigneeId ? (nameById.get(ticket.assigneeId) ?? 'Former member') : undefined
              }
              canEdit={canEdit}
              canDelete={canDelete}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
