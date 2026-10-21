import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import type { SlaTimer, Ticket } from '@/types/support'
import { SlaIndicator } from '../SlaIndicator'
import { formatDateTime } from '../support-formatters'

function SlaRow({ label, timer }: { label: string; timer: SlaTimer }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <SlaIndicator label={label} timer={timer} />
      <p className="text-[11px] text-slate-500">
        Target {formatDateTime(timer.dueAt)}
        {timer.completedAt && <> · done {formatDateTime(timer.completedAt)}</>}
      </p>
    </div>
  )
}

/** First-response and resolution targets with live state (on track, at risk, breached, met, paused). */
export function TicketSlaCard({ ticket }: { ticket: Ticket }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Service level</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SlaRow label="First response" timer={ticket.sla.firstResponse} />
        <SlaRow label="Resolution" timer={ticket.sla.resolution} />
        {ticket.sla.resolution.state === 'paused' && (
          <p className="rounded-md bg-slate-50 px-2.5 py-1.5 text-[11px] text-slate-600">
            Paused while waiting on the customer.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
