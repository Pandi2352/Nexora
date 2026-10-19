import { Star } from 'lucide-react'
import { Badge, type BadgeVariant } from '@/components/ui'
import type { LeadStatus } from '@/types/crm'

const STATUS_CONFIG: Record<LeadStatus, { label: string; variant: BadgeVariant }> = {
  new: { label: 'New', variant: 'brand' },
  contacted: { label: 'Contacted', variant: 'neutral' },
  in_discussion: { label: 'In Discussion', variant: 'warning' },
  qualified: { label: 'Qualified', variant: 'success' },
  proposal_sent: { label: 'Proposal Sent', variant: 'brand' },
  unqualified: { label: 'Unqualified', variant: 'neutral' },
}

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const config = STATUS_CONFIG[status] || { label: status, variant: 'gray' }
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function MustWinBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 border border-amber-500/20">
      <Star className="size-3 fill-amber-500 text-amber-500" />
      Must Win
    </span>
  )
}
