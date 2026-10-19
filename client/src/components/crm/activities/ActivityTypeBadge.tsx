import { Calendar, Clock, FileText, Mail, PhoneCall, StickyNote } from 'lucide-react'
import { Badge, type BadgeVariant } from '@/components/ui'
import type { ActivityOutcome, ActivityType } from '@/types/crm'

export function ActivityTypeBadge({ type }: { type: ActivityType }) {
  switch (type) {
    case 'cold_call':
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-purple-200 bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
          <PhoneCall className="size-3 text-purple-500" />
          Cold Call
        </span>
      )
    case 'meeting':
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
          <Calendar className="size-3 text-blue-500" />
          Meeting
        </span>
      )
    case 'proposal_submitted':
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
          <FileText className="size-3 text-emerald-500" />
          Proposal Submitted
        </span>
      )
    case 'follow_up':
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
          <Clock className="size-3 text-amber-500" />
          Follow Up
        </span>
      )
    case 'email':
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
          <Mail className="size-3 text-slate-500" />
          Email
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
          <StickyNote className="size-3 text-slate-500" />
          Note
        </span>
      )
  }
}

export function ActivityOutcomeBadge({ outcome }: { outcome?: ActivityOutcome }) {
  if (!outcome) return null
  const config: Record<ActivityOutcome, { label: string; variant: BadgeVariant }> = {
    positive: { label: 'Positive', variant: 'success' },
    neutral: { label: 'Neutral', variant: 'neutral' },
    negative: { label: 'Negative', variant: 'critical' },
    followup_needed: { label: 'Follow-up Needed', variant: 'warning' },
  }
  const item = config[outcome] || { label: outcome, variant: 'neutral' }
  return <Badge variant={item.variant}>{item.label}</Badge>
}
