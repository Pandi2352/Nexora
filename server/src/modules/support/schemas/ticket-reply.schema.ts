import { Prop, Schema } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { TenantDocument, createBaseSchema, defaultSchemaOptions } from '@/database/base.schema';
import { REPLY_TYPES, type ReplyType } from '../constants/support.constants';

export type TicketReplyDocument = HydratedDocument<TicketReply>;

/** A public reply to the requester or an internal note visible to staff only (SUP-004, SUP-011). */
@Schema({ ...defaultSchemaOptions, collection: 'ticket_replies' })
export class TicketReply extends TenantDocument {
  @Prop({ type: String, required: true, index: true })
  ticketId: string;

  @Prop({ type: String, enum: REPLY_TYPES, required: true })
  type: ReplyType;

  @Prop({ type: String, required: true, trim: true, maxlength: 10000 })
  body: string;

  @Prop({ type: String, required: true })
  authorId: string;

  /** Name at the time of writing, so history stays readable if the member leaves. */
  @Prop({ type: String, required: true })
  authorName: string;
}

export const TicketReplySchema = createBaseSchema(TicketReply);
TicketReplySchema.index({ organizationId: 1, ticketId: 1, createdAt: 1 });
