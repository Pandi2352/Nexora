import { Building2, Link2, Mail, Phone } from 'lucide-react'
import { Avatar, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import type { Ticket } from '@/types/support'
import { TicketTags } from '../TicketTags'
import { formatDateTime } from '../support-formatters'

/** Who raised the ticket, how to reach them, and ticket metadata. */
export function TicketRequesterCard({ ticket }: { ticket: Ticket }) {
  const { requester } = ticket
  const linkClass =
    'flex items-center gap-2 truncate rounded-md text-sm text-slate-700 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Requester</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <Avatar name={requester.name} />
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">{requester.name}</p>
            {ticket.contactId && (
              <p className="flex items-center gap-1 text-[11px] font-medium text-indigo-600">
                <Link2 className="size-3" aria-hidden /> Linked CRM contact
              </p>
            )}
          </div>
        </div>
        <a
          href={`mailto:${requester.email}?subject=${encodeURIComponent(`[${ticket.ticketKey}] ${ticket.subject}`)}`}
          className={linkClass}
        >
          <Mail className="size-4 shrink-0 text-slate-400" aria-hidden />
          {requester.email}
        </a>
        {requester.phone && (
          <a href={`tel:${requester.phone}`} className={linkClass}>
            <Phone className="size-4 shrink-0 text-slate-400" aria-hidden />
            {requester.phone}
          </a>
        )}
        {requester.companyName && (
          <p className="flex items-center gap-2 text-sm text-slate-700">
            <Building2 className="size-4 shrink-0 text-slate-400" aria-hidden />
            {requester.companyName}
          </p>
        )}
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-slate-100 pt-3 text-xs">
          <dt className="text-slate-500">Replies</dt>
          <dd className="text-right font-medium text-slate-800">{ticket.replyCount}</dd>
          <dt className="text-slate-500">Last activity</dt>
          <dd className="text-right font-medium text-slate-800">
            {formatDateTime(ticket.lastActivityAt)}
          </dd>
          {ticket.closedAt && (
            <>
              <dt className="text-slate-500">Closed</dt>
              <dd className="text-right font-medium text-slate-800">
                {formatDateTime(ticket.closedAt)}
              </dd>
            </>
          )}
        </dl>
        <TicketTags tags={ticket.tags} max={10} />
      </CardContent>
    </Card>
  )
}
