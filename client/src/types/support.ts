import type { PaginationMeta } from './api'

export type TicketStatus =
  'open' | 'in_progress' | 'waiting_on_customer' | 'on_hold' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TicketCategory =
  'general' | 'technical' | 'billing' | 'account' | 'bug' | 'feature_request' | 'other'
export type TicketChannel = 'email' | 'phone' | 'web' | 'chat' | 'internal'
export type ResolutionType =
  'fixed' | 'workaround' | 'answered' | 'duplicate' | 'not_reproducible' | 'wont_fix'
export type ReplyType = 'reply' | 'internal_note'
export type SlaState = 'on_track' | 'at_risk' | 'breached' | 'met' | 'paused'
export type TicketView = 'all' | 'active' | TicketStatus

export interface TicketRequester {
  name: string
  email: string
  phone?: string
  companyName?: string
}

export interface SlaTimer {
  dueAt: string
  state: SlaState
  completedAt?: string
}

export interface Ticket {
  id: string
  ticketNumber: number
  ticketKey: string
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: TicketCategory
  channel: TicketChannel
  requester: TicketRequester
  contactId?: string
  companyId?: string
  assigneeId?: string
  tags: string[]
  firstResponseDueAt: string
  resolutionDueAt: string
  firstRespondedAt?: string
  resolvedAt?: string
  closedAt?: string
  resolution?: { type: ResolutionType; summary: string; resolvedBy: string }
  replyCount: number
  reopenCount: number
  lastActivityAt: string
  createdBy?: string
  createdAt: string
  updatedAt: string
  sla: { firstResponse: SlaTimer; resolution: SlaTimer }
}

export interface TicketReply {
  id: string
  ticketId: string
  type: ReplyType
  body: string
  authorId: string
  authorName: string
  createdAt: string
}

export type TicketEventType =
  | 'created'
  | 'updated'
  | 'status_changed'
  | 'priority_changed'
  | 'assigned'
  | 'unassigned'
  | 'reply_added'
  | 'note_added'
  | 'resolved'
  | 'reopened'

export interface TicketEvent {
  id: string
  ticketId: string
  type: TicketEventType
  actorId: string
  actorName: string
  from?: string
  to?: string
  note?: string
  createdAt: string
}

export interface TicketStats {
  byStatus: Record<TicketStatus | 'all' | 'active', number>
  unassigned: number
  mine: number
  urgent: number
  breached: number
  resolvedLast7Days: number
  avgFirstResponseMinutes: number | null
  avgResolutionMinutes: number | null
}

export interface TicketListParams {
  page?: number
  limit?: number
  sort?:
    | 'createdAt'
    | 'updatedAt'
    | 'lastActivityAt'
    | 'priorityRank'
    | 'resolutionDueAt'
    | 'ticketNumber'
  order?: 'asc' | 'desc'
  search?: string
  view?: TicketView
  priority?: TicketPriority
  category?: TicketCategory
  /** User UUID, `me` or `unassigned` */
  assignee?: string
  sla?: 'breached'
  tag?: string
}

export interface TicketPage {
  items: Ticket[]
  meta: PaginationMeta
}

export interface CreateTicketPayload {
  subject: string
  description: string
  priority?: TicketPriority
  category?: TicketCategory
  channel?: TicketChannel
  requester: TicketRequester
  contactId?: string
  companyId?: string
  assigneeId?: string
  tags?: string[]
}

export type UpdateTicketPayload = Partial<Omit<CreateTicketPayload, 'assigneeId'>>

export interface CreateReplyPayload {
  type: ReplyType
  body: string
  setStatus?: TicketStatus
}

export interface ResolveTicketPayload {
  type: ResolutionType
  summary: string
}
