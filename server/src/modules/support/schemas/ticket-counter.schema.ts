import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type TicketCounterDocument = HydratedDocument<TicketCounter>;

/** One document per workspace; `_id` is the organizationId. Incremented atomically. */
@Schema({ collection: 'ticket_counters', versionKey: false })
export class TicketCounter {
  @Prop({ type: String })
  _id: string;

  @Prop({ type: Number, default: 0 })
  seq: number;
}

export const TicketCounterSchema = SchemaFactory.createForClass(TicketCounter);
