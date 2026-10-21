import { TICKET_NUMBER_PREFIX } from '../constants/support.constants';
import type { TicketDocument } from '../schemas/ticket.schema';
import { computeSla, formatTicketNumber } from './ticket-sla';

/** API shape of a ticket: stored fields + display key + live SLA state. */
export function presentTicket(ticket: TicketDocument, now: Date = new Date()) {
  const json = ticket.toJSON() as unknown as Record<string, unknown>;
  delete json.isDeleted;
  delete json.deletedAt;
  delete json.deletedBy;

  return {
    ...json,
    ticketKey: formatTicketNumber(TICKET_NUMBER_PREFIX, ticket.ticketNumber),
    sla: computeSla(
      {
        status: ticket.status,
        createdAt: ticket.createdAt,
        firstResponseDueAt: ticket.firstResponseDueAt,
        resolutionDueAt: ticket.resolutionDueAt,
        firstRespondedAt: ticket.firstRespondedAt,
        resolvedAt: ticket.resolvedAt,
      },
      now,
    ),
  };
}

export type PresentedTicket = ReturnType<typeof presentTicket>;
