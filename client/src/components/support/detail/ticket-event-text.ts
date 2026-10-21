import type { TicketEvent, TicketPriority, TicketStatus } from '@/types/support'
import { PRIORITY_META, RESOLUTION_LABELS, statusLabel } from '../support-options'

const status = (value?: string) => (value ? statusLabel(value as TicketStatus) : '—')
const priority = (value?: string) => PRIORITY_META[value as TicketPriority]?.label ?? value ?? '—'

/** Human sentence for a history event, e.g. "changed status from Open to In progress". */
export function describeTicketEvent(event: TicketEvent, nameById: Map<string, string>): string {
  const person = (id?: string) => (id ? (nameById.get(id) ?? 'a former member') : 'nobody')
  switch (event.type) {
    case 'created':
      return 'created the ticket'
    case 'status_changed':
      return `changed status from ${status(event.from)} to ${status(event.to)}`
    case 'priority_changed':
      return `changed priority from ${priority(event.from)} to ${priority(event.to)}`
    case 'assigned':
      return `assigned the ticket to ${person(event.to)}`
    case 'unassigned':
      return `unassigned ${person(event.from)}`
    case 'reply_added':
      return 'replied to the requester'
    case 'note_added':
      return 'added an internal note'
    case 'resolved':
      return `resolved the ticket (${RESOLUTION_LABELS[event.to as keyof typeof RESOLUTION_LABELS] ?? event.to})`
    case 'reopened':
      return `reopened the ticket from ${status(event.from)}`
    default:
      return event.note ?? 'updated the ticket'
  }
}
