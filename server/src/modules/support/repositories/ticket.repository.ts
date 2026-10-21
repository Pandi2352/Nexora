import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model, QueryFilter, UpdateQuery } from 'mongoose';
import { escapeRegex } from '@/common';
import { ACTIVE_STATUSES } from '../constants/support.constants';
import type { ListTicketsQueryDto } from '../dto/list-tickets-query.dto';
import { TicketCounter, type TicketCounterDocument } from '../schemas/ticket-counter.schema';
import { Ticket, type TicketDocument } from '../schemas/ticket.schema';

@Injectable()
export class TicketRepository {
  constructor(
    @InjectModel(Ticket.name) private readonly ticketModel: Model<TicketDocument>,
    @InjectModel(TicketCounter.name) private readonly counterModel: Model<TicketCounterDocument>,
  ) {}

  /** Atomic per-workspace sequence: safe under concurrent creates. */
  async nextTicketNumber(orgId: string): Promise<number> {
    const counter = await this.counterModel
      .findOneAndUpdate({ _id: orgId }, { $inc: { seq: 1 } }, { upsert: true, new: true })
      .exec();
    return counter.seq;
  }

  create(data: Partial<Ticket>): Promise<TicketDocument> {
    return this.ticketModel.create(data);
  }

  findById(orgId: string, id: string): Promise<TicketDocument | null> {
    return this.ticketModel.findOne({ _id: id, organizationId: orgId, isDeleted: false }).exec();
  }

  /** Scoped update; returns null when the ticket is missing or in another workspace. */
  update(orgId: string, id: string, update: UpdateQuery<Ticket>): Promise<TicketDocument | null> {
    return this.ticketModel
      .findOneAndUpdate({ _id: id, organizationId: orgId, isDeleted: false }, update, { new: true })
      .exec();
  }

  async softDelete(orgId: string, id: string, userId: string): Promise<boolean> {
    const res = await this.ticketModel
      .updateOne(
        { _id: id, organizationId: orgId, isDeleted: false },
        { $set: { isDeleted: true, deletedAt: new Date(), deletedBy: userId } },
      )
      .exec();
    return res.modifiedCount > 0;
  }

  async list(orgId: string, query: ListTicketsQueryDto, currentUserId: string) {
    const filter = this.buildFilter(orgId, query, currentUserId);
    const direction = query.order === 'asc' ? 1 : -1;
    const [items, total] = await Promise.all([
      this.ticketModel
        .find(filter)
        .sort({ [query.sort]: direction, _id: direction })
        .skip(query.skip)
        .limit(query.limit)
        .exec(),
      this.ticketModel.countDocuments(filter).exec(),
    ]);
    return { items, total };
  }

  private buildFilter(orgId: string, query: ListTicketsQueryDto, currentUserId: string) {
    const filter: QueryFilter<Ticket> = { organizationId: orgId, isDeleted: false };

    if (query.view === 'active') filter.status = { $in: ACTIVE_STATUSES };
    else if (query.view && query.view !== 'all') filter.status = query.view;

    if (query.priority) filter.priority = query.priority;
    if (query.category) filter.category = query.category;
    if (query.tag) filter.tags = query.tag.toLowerCase();

    if (query.assignee === 'me') filter.assigneeId = currentUserId;
    else if (query.assignee === 'unassigned') filter.assigneeId = null;
    else if (query.assignee) filter.assigneeId = query.assignee;

    if (query.sla === 'breached') {
      filter.status = { $in: ACTIVE_STATUSES };
      filter.resolutionDueAt = { $lt: new Date() };
    }

    const search = query.search?.trim();
    if (search) {
      const pattern = new RegExp(escapeRegex(search), 'i');
      const numberMatch = search.match(/^(?:TCK-?)?0*(\d+)$/i);
      filter.$or = [
        { subject: pattern },
        { 'requester.name': pattern },
        { 'requester.email': pattern },
        { 'requester.companyName': pattern },
        { tags: search.toLowerCase() },
        ...(numberMatch ? [{ ticketNumber: Number(numberMatch[1]) }] : []),
      ];
    }
    return filter;
  }
}
