import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AppException, ErrorCode, createPaginationMeta } from '@/common';
import { CompanyRepository } from '../../crm/repositories/company.repository';
import { ContactRepository } from '../../crm/repositories/contact.repository';
import { PRIORITY_RANK, type TicketPriority } from '../constants/support.constants';
import type { CreateTicketDto } from '../dto/create-ticket.dto';
import type { ListTicketsQueryDto } from '../dto/list-tickets-query.dto';
import type { UpdateTicketDto } from '../dto/update-ticket.dto';
import { TicketStatsRepository } from '../repositories/ticket-stats.repository';
import { TicketRepository } from '../repositories/ticket.repository';
import type { TicketDocument } from '../schemas/ticket.schema';
import { SupportAccessService, type SupportContext } from './support-access.service';
import { TicketHistoryService } from './ticket-history.service';
import { presentTicket } from './ticket-presenter';
import { computeSlaDueDates } from './ticket-sla';

const normalizeTags = (tags?: string[]) =>
  tags ? [...new Set(tags.map((t) => t.trim().toLowerCase()).filter(Boolean))] : undefined;

@Injectable()
export class TicketService {
  private readonly logger = new Logger(TicketService.name);

  constructor(
    private readonly ticketRepo: TicketRepository,
    private readonly statsRepo: TicketStatsRepository,
    private readonly access: SupportAccessService,
    private readonly history: TicketHistoryService,
    private readonly contactRepo: ContactRepository,
    private readonly companyRepo: CompanyRepository,
  ) {}

  async list(ctx: SupportContext, query: ListTicketsQueryDto) {
    const { items, total } = await this.ticketRepo.list(ctx.orgId, query, ctx.actorId);
    const now = new Date();
    return {
      items: items.map((t) => presentTicket(t, now)),
      meta: createPaginationMeta(total, query.page, query.limit),
    };
  }

  stats(ctx: SupportContext) {
    return this.statsRepo.getStats(ctx.orgId, ctx.actorId);
  }

  async get(ctx: SupportContext, ticketId: string) {
    return presentTicket(await this.findOrFail(ctx, ticketId));
  }

  async create(ctx: SupportContext, dto: CreateTicketDto) {
    await this.assertCrmLinks(ctx, dto.contactId, dto.companyId);
    if (dto.assigneeId) await this.access.assertAssignable(ctx.orgId, dto.assigneeId);

    const priority: TicketPriority = dto.priority ?? 'medium';
    const now = new Date();
    const ticket = await this.ticketRepo.create({
      ...dto,
      organizationId: ctx.orgId,
      ticketNumber: await this.ticketRepo.nextTicketNumber(ctx.orgId),
      priority,
      priorityRank: PRIORITY_RANK[priority],
      tags: normalizeTags(dto.tags) ?? [],
      ...computeSlaDueDates(now, priority),
      lastActivityAt: now,
      createdBy: ctx.actorId,
      updatedBy: ctx.actorId,
    });

    await this.history.record(ctx, ticket._id, 'created', {
      auditAction: 'ticket.create',
      to: ticket.subject,
    });
    if (dto.assigneeId)
      await this.history.record(ctx, ticket._id, 'assigned', { to: dto.assigneeId });
    this.logger.log(
      `Ticket #${ticket.ticketNumber} created in org=${ctx.orgSlug} by ${ctx.actorId}`,
    );
    return presentTicket(ticket);
  }

  async update(ctx: SupportContext, ticketId: string, dto: UpdateTicketDto) {
    const current = await this.findOrFail(ctx, ticketId);
    await this.assertCrmLinks(ctx, dto.contactId, dto.companyId);

    const set: Record<string, unknown> = {
      ...dto,
      tags: normalizeTags(dto.tags),
      updatedBy: ctx.actorId,
      lastActivityAt: new Date(),
    };
    // SLA targets follow the priority, measured from when the ticket was opened.
    if (dto.priority && dto.priority !== current.priority) {
      Object.assign(
        set,
        { priorityRank: PRIORITY_RANK[dto.priority] },
        computeSlaDueDates(current.createdAt, dto.priority),
      );
    }
    for (const key of Object.keys(set)) if (set[key] === undefined) delete set[key];

    const updated = await this.ticketRepo.update(ctx.orgId, ticketId, { $set: set });
    if (!updated) throw this.notFound();

    if (dto.priority && dto.priority !== current.priority) {
      await this.history.record(ctx, ticketId, 'priority_changed', {
        from: current.priority,
        to: dto.priority,
      });
    }
    const otherChanges = Object.keys(dto).filter((k) => k !== 'priority');
    if (otherChanges.length > 0) {
      await this.history.record(ctx, ticketId, 'updated', {
        note: `Updated ${otherChanges.join(', ')}`,
      });
    }
    return presentTicket(updated);
  }

  async remove(ctx: SupportContext, ticketId: string) {
    const deleted = await this.ticketRepo.softDelete(ctx.orgId, ticketId, ctx.actorId);
    if (!deleted) throw this.notFound();
    await this.history.record(ctx, ticketId, 'updated', {
      note: 'Ticket deleted',
      auditAction: 'ticket.delete',
    });
    return { id: ticketId, deleted: true };
  }

  async findOrFail(ctx: SupportContext, ticketId: string): Promise<TicketDocument> {
    const ticket = await this.ticketRepo.findById(ctx.orgId, ticketId);
    if (!ticket) throw this.notFound();
    return ticket;
  }

  notFound() {
    return new AppException(HttpStatus.NOT_FOUND, 'Ticket not found', ErrorCode.NOT_FOUND);
  }

  /** CRM links must point to records in the same workspace (ORG-011). */
  private async assertCrmLinks(ctx: SupportContext, contactId?: string, companyId?: string) {
    const details: Array<{ field: string; message: string }> = [];
    if (contactId && !(await this.contactRepo.findById(ctx.orgId, contactId))) {
      details.push({ field: 'contactId', message: 'Contact not found in this workspace' });
    }
    if (companyId && !(await this.companyRepo.findById(ctx.orgId, companyId))) {
      details.push({ field: 'companyId', message: 'Company not found in this workspace' });
    }
    if (details.length > 0) {
      throw new AppException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        'Linked CRM record not found',
        ErrorCode.UNPROCESSABLE,
        details,
      );
    }
  }
}
