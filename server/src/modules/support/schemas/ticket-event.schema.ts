import { Prop, Schema } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { TenantDocument, createBaseSchema, defaultSchemaOptions } from '@/database/base.schema';
import { TICKET_EVENT_TYPES, type TicketEventType } from '../constants/support.constants';

export type TicketEventDocument = HydratedDocument<TicketEvent>;

/** Append-only ticket history (SUP-005). */
@Schema({ ...defaultSchemaOptions, collection: 'ticket_events' })
export class TicketEvent extends TenantDocument {
  @Prop({ type: String, required: true, index: true })
  ticketId: string;

  @Prop({ type: String, enum: TICKET_EVENT_TYPES, required: true })
  type: TicketEventType;

  @Prop({ type: String, required: true })
  actorId: string;

  @Prop({ type: String, required: true })
  actorName: string;

  @Prop({ type: String })
  from?: string;

  @Prop({ type: String })
  to?: string;

  @Prop({ type: String, maxlength: 500 })
  note?: string;
}

export const TicketEventSchema = createBaseSchema(TicketEvent);
TicketEventSchema.index({ organizationId: 1, ticketId: 1, createdAt: 1 });
