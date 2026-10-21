import type { BadgeVariant, SelectOption } from '@/components/ui'
import type {
  ResolutionType,
  SlaState,
  TicketCategory,
  TicketChannel,
  TicketPriority,
  TicketStatus,
} from '@/types/support'

export const STATUS_META: Record<TicketStatus, { label: string; variant: BadgeVariant }> = {
  open: { label: 'Open', variant: 'brand' },
  in_progress: { label: 'In progress', variant: 'warning' },
  waiting_on_customer: { label: 'Waiting on customer', variant: 'neutral' },
  on_hold: { label: 'On hold', variant: 'neutral' },
  resolved: { label: 'Resolved', variant: 'success' },
  closed: { label: 'Closed', variant: 'neutral' },
}

export const PRIORITY_META: Record<TicketPriority, { label: string; dot: string; text: string }> = {
  urgent: { label: 'Urgent', dot: 'bg-rose-500', text: 'text-rose-700' },
  high: { label: 'High', dot: 'bg-amber-500', text: 'text-amber-800' },
  medium: { label: 'Medium', dot: 'bg-sky-500', text: 'text-sky-700' },
  low: { label: 'Low', dot: 'bg-slate-400', text: 'text-slate-600' },
}

export const CATEGORY_LABELS: Record<TicketCategory, string> = {
  general: 'General question',
  technical: 'Technical issue',
  billing: 'Billing',
  account: 'Account & access',
  bug: 'Bug report',
  feature_request: 'Feature request',
  other: 'Other',
}

export const CHANNEL_LABELS: Record<TicketChannel, string> = {
  email: 'Email',
  phone: 'Phone',
  web: 'Web form',
  chat: 'Chat',
  internal: 'Internal',
}

export const RESOLUTION_LABELS: Record<ResolutionType, string> = {
  fixed: 'Fixed',
  workaround: 'Workaround provided',
  answered: 'Question answered',
  duplicate: 'Duplicate',
  not_reproducible: 'Could not reproduce',
  wont_fix: "Won't fix",
}

export const SLA_META: Record<SlaState, { label: string; className: string }> = {
  on_track: { label: 'On track', className: 'text-emerald-700' },
  at_risk: { label: 'At risk', className: 'text-amber-700' },
  breached: { label: 'Breached', className: 'text-rose-700' },
  met: { label: 'Met', className: 'text-emerald-700' },
  paused: { label: 'Paused', className: 'text-slate-500' },
}

/** SLA targets shown in the form, mirroring the server policy (minutes). */
export const SLA_TARGETS: Record<TicketPriority, { firstResponse: number; resolution: number }> = {
  urgent: { firstResponse: 60, resolution: 4 * 60 },
  high: { firstResponse: 4 * 60, resolution: 24 * 60 },
  medium: { firstResponse: 8 * 60, resolution: 3 * 24 * 60 },
  low: { firstResponse: 24 * 60, resolution: 5 * 24 * 60 },
}

/** Manual status changes allowed by the server (resolve/reopen are separate actions). */
export const STATUS_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  open: ['in_progress', 'waiting_on_customer', 'on_hold', 'closed'],
  in_progress: ['open', 'waiting_on_customer', 'on_hold', 'closed'],
  waiting_on_customer: ['in_progress', 'on_hold', 'closed'],
  on_hold: ['in_progress', 'waiting_on_customer', 'closed'],
  resolved: ['closed'],
  closed: [],
}

export const ACTIVE_STATUSES: TicketStatus[] = [
  'open',
  'in_progress',
  'waiting_on_customer',
  'on_hold',
]

const toOptions = <T extends string>(labels: Record<T, string>): SelectOption<T>[] =>
  (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }))

export const PRIORITY_OPTIONS: SelectOption<TicketPriority>[] = (
  ['urgent', 'high', 'medium', 'low'] as const
).map((value) => ({ value, label: PRIORITY_META[value].label }))
export const CATEGORY_OPTIONS = toOptions(CATEGORY_LABELS)
export const CHANNEL_OPTIONS = toOptions(CHANNEL_LABELS)
export const RESOLUTION_OPTIONS = toOptions(RESOLUTION_LABELS)
export const statusLabel = (status: TicketStatus) => STATUS_META[status].label
