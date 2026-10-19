import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { BaseDocument } from '@/database/base.schema';

export type OpportunityDocument = HydratedDocument<Opportunity>;

@Schema({ collection: 'opportunities', timestamps: true, versionKey: false })
export class Opportunity extends BaseDocument {
  @Prop({ type: String, required: true, index: true })
  organizationId: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 150 })
  title: string;

  @Prop({ type: String, index: true })
  companyId?: string;

  @Prop({ type: String, trim: true })
  companyName?: string;

  @Prop({ type: String, index: true })
  leadId?: string;

  @Prop({
    type: String,
    enum: ['qualification', 'needs_analysis', 'proposal_quote', 'negotiation', 'closed_won', 'closed_lost'],
    default: 'qualification',
  })
  stage: string;

  // Deal or Quote Value in INR (₹)
  @Prop({ type: Number, default: 0 })
  value: number;

  // Win probability 0 to 100%
  @Prop({ type: Number, default: 20 })
  probability: number;

  @Prop({ type: Date })
  expectedCloseDate?: Date;

  @Prop({ type: String, required: true, index: true })
  ownerId: string;

  @Prop({ type: Boolean, default: false })
  isMustWin: boolean;

  // Quotation fields
  @Prop({ type: String, trim: true })
  quotationNumber?: string;

  @Prop({
    type: String,
    enum: ['draft', 'sent', 'accepted', 'declined'],
  })
  quotationStatus?: string;

  @Prop({ type: String, trim: true, maxlength: 2000 })
  notes?: string;
}

export const OpportunitySchema = SchemaFactory.createForClass(Opportunity);
OpportunitySchema.index({ organizationId: 1, stage: 1 });
OpportunitySchema.index({ organizationId: 1, isMustWin: 1 });
OpportunitySchema.index({ organizationId: 1, ownerId: 1 });
OpportunitySchema.index({ organizationId: 1, createdAt: -1 });
