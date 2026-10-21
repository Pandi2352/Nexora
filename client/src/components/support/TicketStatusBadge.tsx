import { Badge } from '@/components/ui'
import type { TicketStatus } from '@/types/support'
import { STATUS_META } from './support-options'

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const meta = STATUS_META[status]
  return (
    <Badge variant={meta.variant} className="whitespace-nowrap">
      {meta.label}
    </Badge>
  )
}
