export const TICKET_STATUSES = [
  'open',
  'in_progress',
  'waiting_on_customer',
  'on_hold',
  'resolved',
  'closed',
] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const TICKET_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export const TICKET_CATEGORIES = [
  'general',
  'technical',
  'billing',
  'account',
  'bug',
  'feature_request',
  'other',
] as const;
export type TicketCategory = (typeof TICKET_CATEGORIES)[number];

export const TICKET_CHANNELS = ['email', 'phone', 'web', 'chat', 'internal'] as const;
export type TicketChannel = (typeof TICKET_CHANNELS)[number];

export const RESOLUTION_TYPES = [
  'fixed',
  'workaround',
  'answered',
  'duplicate',
  'not_reproducible',
  'wont_fix',
] as const;
export type ResolutionType = (typeof RESOLUTION_TYPES)[number];

export const REPLY_TYPES = ['reply', 'internal_note'] as const;
export type ReplyType = (typeof REPLY_TYPES)[number];

export const TICKET_EVENT_TYPES = [
  'created',
  'updated',
  'status_changed',
  'priority_changed',
  'assigned',
  'unassigned',
  'reply_added',
  'note_added',
  'resolved',
  'reopened',
] as const;
export type TicketEventType = (typeof TICKET_EVENT_TYPES)[number];

/** Statuses where the ticket is still being worked on. SLA clocks run only for these. */
export const ACTIVE_STATUSES: TicketStatus[] = [
  'open',
  'in_progress',
  'waiting_on_customer',
  'on_hold',
];

/**
 * Allowed manual status changes. `resolved` is reached only through the resolve action
 * (it needs a resolution) and reopening goes through the reopen action.
 */
export const STATUS_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  open: ['in_progress', 'waiting_on_customer', 'on_hold', 'closed'],
  in_progress: ['open', 'waiting_on_customer', 'on_hold', 'closed'],
  waiting_on_customer: ['in_progress', 'on_hold', 'closed'],
  on_hold: ['in_progress', 'waiting_on_customer', 'closed'],
  resolved: ['closed'],
  closed: [],
};

/** SLA targets in minutes, by priority (SUP-007). */
export const SLA_POLICY: Record<TicketPriority, { firstResponse: number; resolution: number }> = {
  urgent: { firstResponse: 60, resolution: 4 * 60 },
  high: { firstResponse: 4 * 60, resolution: 24 * 60 },
  medium: { firstResponse: 8 * 60, resolution: 3 * 24 * 60 },
  low: { firstResponse: 24 * 60, resolution: 5 * 24 * 60 },
};

/** Share of the SLA window left below which a ticket counts as "at risk". */
export const SLA_AT_RISK_THRESHOLD = 0.25;

export const TICKET_NUMBER_PREFIX = 'TCK';

export const TICKET_SORT_FIELDS = [
  'createdAt',
  'updatedAt',
  'lastActivityAt',
  'priorityRank',
  'resolutionDueAt',
  'ticketNumber',
] as const;

export const PRIORITY_RANK: Record<TicketPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
};

export const SupportPermission = {
  Read: 'tickets:read',
  Write: 'tickets:write',
  Manage: 'tickets:manage',
} as const;
