import { cn } from '@/lib/cn'
import type { TicketPriority } from '@/types/support'
import { PRIORITY_META } from './support-options'

export function TicketPriorityBadge({ priority }: { priority: TicketPriority }) {
  const meta = PRIORITY_META[priority]
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-semibold', meta.text)}>
      <span aria-hidden className={cn('size-2 rounded-full', meta.dot)} />
      {meta.label}
    </span>
  )
}
