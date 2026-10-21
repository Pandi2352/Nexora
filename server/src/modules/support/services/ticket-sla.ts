import { addMinutes } from '@/common';
import {
  ACTIVE_STATUSES,
  SLA_AT_RISK_THRESHOLD,
  SLA_POLICY,
  type TicketPriority,
  type TicketStatus,
} from '../constants/support.constants';

export type SlaState = 'on_track' | 'at_risk' | 'breached' | 'met' | 'paused';

export interface SlaTimer {
  dueAt: Date;
  state: SlaState;
  completedAt?: Date;
}

/** Due dates for a ticket opened at `openedAt` with `priority`. */
export function computeSlaDueDates(openedAt: Date, priority: TicketPriority) {
  const policy = SLA_POLICY[priority];
  return {
    firstResponseDueAt: addMinutes(openedAt, policy.firstResponse),
    resolutionDueAt: addMinutes(openedAt, policy.resolution),
  };
}

function evaluate(
  startedAt: Date,
  dueAt: Date,
  completedAt: Date | undefined,
  running: boolean,
  now: Date,
): SlaState {
  if (completedAt) return completedAt.getTime() <= dueAt.getTime() ? 'met' : 'breached';
  if (now.getTime() > dueAt.getTime()) return 'breached';
  if (!running) return 'paused';
  const window = dueAt.getTime() - startedAt.getTime();
  const left = dueAt.getTime() - now.getTime();
  return window > 0 && left / window <= SLA_AT_RISK_THRESHOLD ? 'at_risk' : 'on_track';
}

export interface SlaInput {
  status: TicketStatus;
  createdAt: Date;
  firstResponseDueAt: Date;
  resolutionDueAt: Date;
  firstRespondedAt?: Date;
  resolvedAt?: Date;
}

/** First-response and resolution SLA state, derived on read (never stored). */
export function computeSla(ticket: SlaInput, now: Date = new Date()) {
  const active = ACTIVE_STATUSES.includes(ticket.status);
  // Waiting on the customer pauses the resolution clock (state only; due date is unchanged).
  const resolutionRunning = active && ticket.status !== 'waiting_on_customer';

  return {
    firstResponse: {
      dueAt: ticket.firstResponseDueAt,
      completedAt: ticket.firstRespondedAt,
      state: evaluate(
        ticket.createdAt,
        ticket.firstResponseDueAt,
        ticket.firstRespondedAt,
        active,
        now,
      ),
    } satisfies SlaTimer,
    resolution: {
      dueAt: ticket.resolutionDueAt,
      completedAt: ticket.resolvedAt,
      state: evaluate(
        ticket.createdAt,
        ticket.resolutionDueAt,
        ticket.resolvedAt,
        resolutionRunning,
        now,
      ),
    } satisfies SlaTimer,
  };
}

export function formatTicketNumber(prefix: string, seq: number): string {
  return `${prefix}-${String(seq).padStart(4, '0')}`;
}
