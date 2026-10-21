import { HttpStatus, Injectable } from '@nestjs/common';
import { AppException, ErrorCode } from '@/common';
import {
  ACTIVE_STATUSES,
  STATUS_TRANSITIONS,
  SupportPermission,
  type TicketStatus,
} from '../constants/support.constants';
import type {
  AssignTicketDto,
  ChangeTicketStatusDto,
  ReopenTicketDto,
  ResolveTicketDto,
} from '../dto/ticket-actions.dto';
import { TicketRepository } from '../repositories/ticket.repository';
import { SupportAccessService, type SupportContext } from './support-access.service';
import { TicketHistoryService } from './ticket-history.service';
import { presentTicket } from './ticket-presenter';
import { computeSlaDueDates } from './ticket-sla';
import { TicketService } from './ticket.service';

const unprocessable = (message: string) =>
  new AppException(HttpStatus.UNPROCESSABLE_ENTITY, message, ErrorCode.UNPROCESSABLE);

/** Status lifecycle, assignment, resolution and reopening (SUP-002, SUP-012, PM-013-style transitions). */
@Injectable()
export class TicketWorkflowService {
  constructor(
    private readonly tickets: TicketService,
    private readonly ticketRepo: TicketRepository,
    private readonly access: SupportAccessService,
    private readonly history: TicketHistoryService,
  ) {}

  async changeStatus(ctx: SupportContext, ticketId: string, dto: ChangeTicketStatusDto) {
    const current = await this.tickets.findOrFail(ctx, ticketId);
    if (dto.status === current.status) return presentTicket(current);
    if (dto.status === 'resolved')
      throw unprocessable('Use the resolve action to add a resolution');
    if (!STATUS_TRANSITIONS[current.status].includes(dto.status)) {
      throw unprocessable(
        `A ${current.status.replace(/_/g, ' ')} ticket cannot move to ${dto.status.replace(/_/g, ' ')}`,
      );
    }

    const now = new Date();
    const set: Record<string, unknown> = {
      status: dto.status,
      lastActivityAt: now,
      updatedBy: ctx.actorId,
    };
    if (dto.status === 'closed') set.closedAt = now;

    const updated = await this.ticketRepo.update(ctx.orgId, ticketId, { $set: set });
    if (!updated) throw this.tickets.notFound();
    await this.history.record(ctx, ticketId, 'status_changed', {
      from: current.status,
      to: dto.status,
      note: dto.note,
      auditAction: 'ticket.status',
    });
    return presentTicket(updated);
  }

  async assign(ctx: SupportContext, ticketId: string, dto: AssignTicketDto) {
    const current = await this.tickets.findOrFail(ctx, ticketId);
    if (current.status === 'closed') throw unprocessable('Closed tickets cannot be reassigned');
    if (dto.assigneeId === (current.assigneeId ?? null)) return presentTicket(current);

    // Taking or releasing your own ticket needs write access; routing to others needs manage (SUP-002).
    const touchesOthers =
      (dto.assigneeId !== null && dto.assigneeId !== ctx.actorId) ||
      (!!current.assigneeId && current.assigneeId !== ctx.actorId);
    if (touchesOthers && !ctx.can(SupportPermission.Manage)) {
      throw new AppException(
        HttpStatus.FORBIDDEN,
        'Only support managers can assign tickets to others',
        ErrorCode.FORBIDDEN,
      );
    }
    if (dto.assigneeId) await this.access.assertAssignable(ctx.orgId, dto.assigneeId);

    const base = { lastActivityAt: new Date(), updatedBy: ctx.actorId };
    const updated = await this.ticketRepo.update(
      ctx.orgId,
      ticketId,
      dto.assigneeId
        ? { $set: { ...base, assigneeId: dto.assigneeId } }
        : { $set: base, $unset: { assigneeId: 1 } },
    );
    if (!updated) throw this.tickets.notFound();

    await this.history.record(ctx, ticketId, dto.assigneeId ? 'assigned' : 'unassigned', {
      from: current.assigneeId,
      to: dto.assigneeId ?? undefined,
      auditAction: 'ticket.assign',
    });
    return presentTicket(updated);
  }

  async resolve(ctx: SupportContext, ticketId: string, dto: ResolveTicketDto) {
    const current = await this.tickets.findOrFail(ctx, ticketId);
    if (!ACTIVE_STATUSES.includes(current.status))
      throw unprocessable('Only open tickets can be resolved');

    const now = new Date();
    const updated = await this.ticketRepo.update(ctx.orgId, ticketId, {
      $set: {
        status: 'resolved' satisfies TicketStatus,
        resolvedAt: now,
        resolution: { type: dto.type, summary: dto.summary.trim(), resolvedBy: ctx.actorId },
        lastActivityAt: now,
        updatedBy: ctx.actorId,
      },
    });
    if (!updated) throw this.tickets.notFound();

    await this.history.record(ctx, ticketId, 'resolved', {
      from: current.status,
      to: dto.type,
      note: dto.summary.slice(0, 500),
      auditAction: 'ticket.resolve',
    });
    return presentTicket(updated);
  }

  async reopen(ctx: SupportContext, ticketId: string, dto: ReopenTicketDto) {
    const current = await this.tickets.findOrFail(ctx, ticketId);
    if (current.status !== 'resolved' && current.status !== 'closed') {
      throw unprocessable('Only resolved or closed tickets can be reopened');
    }

    // The resolution clock restarts from the reopen; first-response history is kept.
    const now = new Date();
    const { resolutionDueAt } = computeSlaDueDates(now, current.priority);
    const updated = await this.ticketRepo.update(ctx.orgId, ticketId, {
      $set: {
        status: 'open' satisfies TicketStatus,
        resolutionDueAt,
        lastActivityAt: now,
        updatedBy: ctx.actorId,
      },
      $unset: { resolvedAt: 1, closedAt: 1, resolution: 1 },
      $inc: { reopenCount: 1 },
    });
    if (!updated) throw this.tickets.notFound();

    await this.history.record(ctx, ticketId, 'reopened', {
      from: current.status,
      to: 'open',
      note: dto.reason,
      auditAction: 'ticket.reopen',
    });
    return presentTicket(updated);
  }
}
