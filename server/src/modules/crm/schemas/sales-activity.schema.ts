import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { BaseDocument, defaultSchemaOptions, applyBaseSchemaPlugins } from '@/database/base.schema';

export type SalesActivityDocument = HydratedDocument<SalesActivity>;

@Schema({ ...defaultSchemaOptions, collection: 'sales_activities' })
export class SalesActivity extends BaseDocument {
  @Prop({ type: String, required: true, index: true })
  organizationId: string;

  @Prop({
    type: String,
    required: true,
    enum: ['cold_call', 'meeting', 'proposal_submitted', 'follow_up', 'email', 'note'],
  })
  type: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 200 })
  title: string;

  @Prop({ type: String, trim: true, maxlength: 2000 })
  description?: string;

  @Prop({ type: String, index: true })
  companyId?: string;

  @Prop({ type: String, index: true })
  leadId?: string;

  @Prop({ type: String, index: true })
  contactId?: string;

  @Prop({ type: String, required: true, index: true })
  performedById: string;

  @Prop({ type: Date })
  scheduledAt?: Date;

  @Prop({ type: Date })
  completedAt?: Date;

  @Prop({
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'completed',
  })
  status: string;

  @Prop({
    type: String,
    enum: ['positive', 'neutral', 'negative', 'followup_needed'],
  })
  outcome?: string;

  // Proposal submitted amount in INR (₹)
  @Prop({ type: Number })
  proposalValue?: number;
}

export const SalesActivitySchema = applyBaseSchemaPlugins(SchemaFactory.createForClass(SalesActivity));
SalesActivitySchema.index({ organizationId: 1, type: 1 });
SalesActivitySchema.index({ organizationId: 1, companyId: 1 });
SalesActivitySchema.index({ organizationId: 1, leadId: 1 });
SalesActivitySchema.index({ organizationId: 1, createdAt: -1 });
