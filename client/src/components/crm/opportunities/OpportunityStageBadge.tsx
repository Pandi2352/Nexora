import { Badge, type BadgeVariant } from '@/components/ui'
import type { OpportunityStage, QuotationStatus } from '@/types/crm'

export const STAGE_CONFIG: Record<
  OpportunityStage,
  { label: string; variant: BadgeVariant; color: string }
> = {
  qualification: { label: 'Qualification', variant: 'neutral', color: 'border-slate-300' },
  needs_analysis: { label: 'Needs Analysis', variant: 'brand', color: 'border-blue-300' },
  proposal_quote: { label: 'Proposal / Quote', variant: 'warning', color: 'border-amber-300' },
  negotiation: { label: 'Negotiation', variant: 'brand', color: 'border-purple-300' },
  closed_won: { label: 'Closed Won', variant: 'success', color: 'border-emerald-300' },
  closed_lost: { label: 'Closed Lost', variant: 'critical', color: 'border-rose-300' },
}

export function OpportunityStageBadge({ stage }: { stage: OpportunityStage }) {
  const config = STAGE_CONFIG[stage] || { label: stage, variant: 'neutral' }
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function QuotationStatusBadge({ status }: { status?: QuotationStatus }) {
  if (!status) return null
  const config: Record<QuotationStatus, { label: string; variant: BadgeVariant }> = {
    draft: { label: 'Quote: Draft', variant: 'neutral' },
    sent: { label: 'Quote: Sent', variant: 'brand' },
    accepted: { label: 'Quote: Accepted', variant: 'success' },
    declined: { label: 'Quote: Declined', variant: 'critical' },
  }
  const item = config[status] || { label: status, variant: 'neutral' }
  return <Badge variant={item.variant}>{item.label}</Badge>
}
