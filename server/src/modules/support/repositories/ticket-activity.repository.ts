import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { ReplyType } from '../constants/support.constants';
import { TicketEvent, type TicketEventDocument } from '../schemas/ticket-event.schema';
import { TicketReply, type TicketReplyDocument } from '../schemas/ticket-reply.schema';

/** Conversation (replies, internal notes) and history events of tickets. */
@Injectable()
export class TicketActivityRepository {
  constructor(
    @InjectModel(TicketReply.name) private readonly replyModel: Model<TicketReplyDocument>,
    @InjectModel(TicketEvent.name) private readonly eventModel: Model<TicketEventDocument>,
  ) {}

  createReply(data: Partial<TicketReply>): Promise<TicketReplyDocument> {
    return this.replyModel.create(data);
  }

  listReplies(orgId: string, ticketId: string, types: ReplyType[]): Promise<TicketReplyDocument[]> {
    return this.replyModel
      .find({ organizationId: orgId, ticketId, type: { $in: types } })
      .sort({ createdAt: 1 })
      .exec();
  }

  createEvent(data: Partial<TicketEvent>): Promise<TicketEventDocument> {
    return this.eventModel.create(data);
  }

  listEvents(orgId: string, ticketId: string): Promise<TicketEventDocument[]> {
    return this.eventModel.find({ organizationId: orgId, ticketId }).sort({ createdAt: 1 }).exec();
  }
}
