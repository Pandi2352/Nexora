import {
  ArrowRightLeft,
  CheckCircle2,
  CirclePlus,
  Gauge,
  Lock,
  MessageSquareReply,
  Pencil,
  RotateCcw,
  UserCheck,
  UserMinus,
} from 'lucide-react'
import type { TicketEvent, TicketEventType } from '@/types/support'
import { formatDateTime, formatRelative } from '../support-formatters'
import { describeTicketEvent } from './ticket-event-text'

const ICONS: Record<TicketEventType, typeof Pencil> = {
  created: CirclePlus,
  updated: Pencil,
  status_changed: ArrowRightLeft,
  priority_changed: Gauge,
  assigned: UserCheck,
  unassigned: UserMinus,
  reply_added: MessageSquareReply,
  note_added: Lock,
  resolved: CheckCircle2,
  reopened: RotateCcw,
}

interface TicketHistoryTimelineProps {
  events: TicketEvent[]
  nameById: Map<string, string>
}

/** Append-only audit trail of everything that happened to the ticket. */
export function TicketHistoryTimeline({ events, nameById }: TicketHistoryTimelineProps) {
  if (events.length === 0) return <p className="text-sm text-slate-500">No history yet.</p>

  return (
    <ol className="relative ml-3 space-y-5 border-l border-slate-200">
      {[...events].reverse().map((event) => {
        const Icon = ICONS[event.type] ?? Pencil
        return (
          <li key={event.id} className="ml-5">
            <span className="absolute -left-3 flex size-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500">
              <Icon className="size-3.5" aria-hidden />
            </span>
            <p className="text-sm text-slate-700">
              <span className="font-semibold text-slate-900">{event.actorName}</span>{' '}
              {describeTicketEvent(event, nameById)}
            </p>
            {event.note && event.type !== 'updated' && (
              <p className="mt-1 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600">
                {event.note}
              </p>
            )}
            {event.type === 'updated' && event.note && (
              <p className="mt-0.5 text-xs text-slate-500">{event.note}</p>
            )}
            <time
              dateTime={event.createdAt}
              title={formatDateTime(event.createdAt)}
              className="text-xs text-slate-500"
            >
              {formatRelative(event.createdAt)}
            </time>
          </li>
        )
      })}
    </ol>
  )
}
