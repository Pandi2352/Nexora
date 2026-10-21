import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import {
  TenantSoftDeleteDocument,
  createBaseSchema,
  defaultSchemaOptions,
} from '@/database/base.schema';
import {
  RESOLUTION_TYPES,
  TICKET_CATEGORIES,
  TICKET_CHANNELS,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  type ResolutionType,
  type TicketCategory,
  type TicketChannel,
  type TicketPriority,
  type TicketStatus,
} from '../constants/support.constants';

export type TicketDocument = HydratedDocument<Ticket>;

@Schema({ _id: false, versionKey: false })
export class TicketRequester {
  @Prop({ type: String, required: true, trim: true, maxlength: 150 })
  name: string;

  @Prop({ type: String, required: true, trim: true, lowercase: true, maxlength: 150 })
  email: string;

  @Prop({ type: String, trim: true, maxlength: 50 })
  phone?: string;

  @Prop({ type: String, trim: true, maxlength: 150 })
  companyName?: string;
}

export const TicketRequesterSchema = SchemaFactory.createForClass(TicketRequester);

@Schema({ _id: false, versionKey: false })
export class TicketResolution {
  @Prop({ type: String, enum: RESOLUTION_TYPES, required: true })
  type: ResolutionType;

  @Prop({ type: String, required: true, trim: true, maxlength: 5000 })
  summary: string;

  @Prop({ type: String, required: true })
  resolvedBy: string;
}

export const TicketResolutionSchema = SchemaFactory.createForClass(TicketResolution);

@Schema({ ...defaultSchemaOptions, collection: 'tickets' })
export class Ticket extends TenantSoftDeleteDocument {
  /** Sequential per workspace; shown as TCK-0001. */
  @Prop({ type: Number, required: true })
  ticketNumber: number;

  @Prop({ type: String, required: true, trim: true, maxlength: 200 })
  subject: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 10000 })
  description: string;

  @Prop({ type: String, enum: TICKET_STATUSES, default: 'open', index: true })
  status: TicketStatus;

  @Prop({ type: String, enum: TICKET_PRIORITIES, default: 'medium' })
  priority: TicketPriority;

  /** 1 (low) … 4 (urgent), for sorting by priority. */
  @Prop({ type: Number, default: 2 })
  priorityRank: number;

  @Prop({ type: String, enum: TICKET_CATEGORIES, default: 'general' })
  category: TicketCategory;

  @Prop({ type: String, enum: TICKET_CHANNELS, default: 'web' })
  channel: TicketChannel;

  @Prop({ type: TicketRequesterSchema, required: true })
  requester: TicketRequester;

  /** Optional links to CRM records in the same workspace. */
  @Prop({ type: String })
  contactId?: string;

  @Prop({ type: String })
  companyId?: string;

  @Prop({ type: String, index: true })
  assigneeId?: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Date, required: true })
  firstResponseDueAt: Date;

  @Prop({ type: Date, required: true })
  resolutionDueAt: Date;

  @Prop({ type: Date })
  firstRespondedAt?: Date;

  @Prop({ type: Date })
  resolvedAt?: Date;

  @Prop({ type: Date })
  closedAt?: Date;

  @Prop({ type: TicketResolutionSchema })
  resolution?: TicketResolution;

  @Prop({ type: Number, default: 0 })
  replyCount: number;

  @Prop({ type: Number, default: 0 })
  reopenCount: number;

  @Prop({ type: Date, default: () => new Date() })
  lastActivityAt: Date;
}

export const TicketSchema = createBaseSchema(Ticket);
TicketSchema.index({ organizationId: 1, ticketNumber: 1 }, { unique: true });
TicketSchema.index({ organizationId: 1, isDeleted: 1, status: 1, lastActivityAt: -1 });
TicketSchema.index({ organizationId: 1, isDeleted: 1, assigneeId: 1, status: 1 });
TicketSchema.index({ organizationId: 1, isDeleted: 1, resolutionDueAt: 1 });
TicketSchema.index({ organizationId: 1, isDeleted: 1, createdAt: -1 });
