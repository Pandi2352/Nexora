import { HttpStatus, Injectable } from '@nestjs/common';
import { AppException, ErrorCode } from '@/common';
import { SupportPermission, type ReplyType } from '../constants/support.constants';
import type { CreateReplyDto } from '../dto/create-reply.dto';
import { TicketActivityRepository } from '../repositories/ticket-activity.repository';
import { TicketRepository } from '../repositories/ticket.repository';
import type { SupportContext } from './support-access.service';
import { TicketHistoryService } from './ticket-history.service';
import { presentTicket } from './ticket-presenter';
import { TicketWorkflowService } from './ticket-workflow.service';
import { TicketService } from './ticket.service';

/** Replies, internal notes and the history timeline of a ticket (SUP-004, SUP-005, SUP-011). */
@Injectable()
export class TicketConversationService {
  constructor(
    private readonly tickets: TicketService,
    private readonly workflow: TicketWorkflowService,
    private readonly ticketRepo: TicketRepository,
    private readonly activityRepo: TicketActivityRepository,
    private readonly history: TicketHistoryService,
  ) {}

  async listReplies(ctx: SupportContext, ticketId: string) {
    await this.tickets.findOrFail(ctx, ticketId);
    // Internal notes are staff-only: readers without write access see public replies only.
    const types: ReplyType[] = ctx.can(SupportPermission.Write)
      ? ['reply', 'internal_note']
      : ['reply'];
    const replies = await this.activityRepo.listReplies(ctx.orgId, ticketId, types);
    return replies.map((r) => r.toJSON());
  }

  async listEvents(ctx: SupportContext, ticketId: string) {
    await this.tickets.findOrFail(ctx, ticketId);
    const events = await this.activityRepo.listEvents(ctx.orgId, ticketId);
    return events.map((e) => e.toJSON());
  }

  async addReply(ctx: SupportContext, ticketId: string, dto: CreateReplyDto) {
    const ticket = await this.tickets.findOrFail(ctx, ticketId);
    if (ticket.status === 'closed') {
      throw new AppException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        'Closed tickets cannot receive replies. Reopen the ticket first.',
        ErrorCode.UNPROCESSABLE,
      );
    }
    if (dto.setStatus === 'resolved') {
      throw new AppException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        'Use the resolve action to add a resolution',
        ErrorCode.UNPROCESSABLE,
      );
    }

    const now = new Date();
    const isPublic = dto.type === 'reply';
    const reply = await this.activityRepo.createReply({
      organizationId: ctx.orgId,
      ticketId,
      type: dto.type,
      body: dto.body.trim(),
      authorId: ctx.actorId,
      authorName: ctx.actorName,
      createdBy: ctx.actorId,
    });

    const set: Record<string, unknown> = { lastActivityAt: now, updatedBy: ctx.actorId };
    if (isPublic && !ticket.firstRespondedAt) set.firstRespondedAt = now;
    let updated = await this.ticketRepo.update(ctx.orgId, ticketId, {
      $set: set,
      $inc: { replyCount: 1 },
    });
    await this.history.record(ctx, ticketId, isPublic ? 'reply_added' : 'note_added');

    // "Send and set status", or move a fresh ticket into progress on the first public reply.
    const nextStatus =
      dto.setStatus ?? (isPublic && ticket.status === 'open' ? 'in_progress' : undefined);
    if (nextStatus && nextStatus !== ticket.status) {
      return {
        reply: reply.toJSON(),
        ticket: await this.workflow.changeStatus(ctx, ticketId, { status: nextStatus }),
      };
    }
    if (!updated) updated = ticket;
    return { reply: reply.toJSON(), ticket: presentTicket(updated) };
  }
}
