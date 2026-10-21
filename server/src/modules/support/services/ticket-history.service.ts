import { Injectable } from '@nestjs/common';
import { AuditService } from '../../audit/audit.service';
import type { TicketEventType } from '../constants/support.constants';
import { TicketActivityRepository } from '../repositories/ticket-activity.repository';
import type { SupportContext } from './support-access.service';

interface RecordOptions {
  from?: string;
  to?: string;
  note?: string;
  /** Also write a workspace audit log entry with this action (e.g. `ticket.assign`). */
  auditAction?: string;
}

/** Writes the ticket history timeline (SUP-005) and, for key actions, the workspace audit log. */
@Injectable()
export class TicketHistoryService {
  constructor(
    private readonly activityRepo: TicketActivityRepository,
    private readonly auditService: AuditService,
  ) {}

  async record(
    ctx: SupportContext,
    ticketId: string,
    type: TicketEventType,
    options: RecordOptions = {},
  ) {
    await this.activityRepo.createEvent({
      organizationId: ctx.orgId,
      ticketId,
      type,
      actorId: ctx.actorId,
      actorName: ctx.actorName,
      from: options.from,
      to: options.to,
      note: options.note,
      createdBy: ctx.actorId,
    });

    if (options.auditAction) {
      await this.auditService.log({
        organizationId: ctx.orgId,
        actorId: ctx.actorId,
        actorName: ctx.actorName,
        actorEmail: ctx.actorEmail,
        action: options.auditAction,
        targetType: 'ticket',
        targetId: ticketId,
        metadata: { from: options.from, to: options.to, note: options.note },
      });
    }
  }
}
