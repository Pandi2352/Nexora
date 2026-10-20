import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { BaseDocument, defaultSchemaOptions, applyBaseSchemaPlugins } from '@/database/base.schema';

export type LeadDocument = HydratedDocument<Lead>;

@Schema({ ...defaultSchemaOptions, collection: 'leads' })
export class Lead extends BaseDocument {
  @Prop({ type: String, required: true, index: true })
  organizationId: string;

  // Company Name & Link
  @Prop({ type: String, required: true, trim: true, maxlength: 150 })
  companyName: string;

  @Prop({ type: String, index: true })
  companyId?: string;

  // Lead Details
  @Prop({
    type: String,
    enum: ['new', 'contacted', 'in_discussion', 'qualified', 'proposal_sent', 'unqualified'],
    default: 'new',
  })
  status: string;

  @Prop({ type: String, required: true, index: true })
  leadOwnerId: string;

  @Prop({
    type: String,
    enum: ['website', 'referral', 'cold_call', 'linkedin', 'event', 'partner', 'other'],
    default: 'other',
  })
  source: string;

  @Prop({
    type: String,
    enum: ['inbound', 'outbound', 'partner', 'expansion'],
    default: 'inbound',
  })
  type: string;

  @Prop({ type: Date })
  meetingDate?: Date;

  @Prop({ type: Date })
  nextContactDate?: Date;

  @Prop({ type: Date })
  expectedConversionDate?: Date;

  // Funnel Information
  @Prop({
    type: String,
    enum: ['enterprise', 'mid_market', 'smb', 'government', 'digital'],
    default: 'enterprise',
  })
  businessUnit: string;

  @Prop({
    type: String,
    enum: ['recurring', 'one_time', 'fixed_bid', 'time_and_materials'],
    default: 'recurring',
  })
  revenueType: string;

  @Prop({
    type: String,
    enum: ['software_license', 'implementation', 'managed_services', 'consulting'],
    default: 'software_license',
  })
  revenueCategory: string;

  @Prop({
    type: String,
    enum: ['monthly', 'quarterly', 'annually', 'milestone'],
    default: 'annually',
  })
  revenueFrequency: string;

  @Prop({ type: String, trim: true })
  billingStartMonth?: string;

  // Annual revenue target in INR (₹)
  @Prop({ type: Number, default: 0 })
  annualRevenueTarget: number;

  // Contract duration in years (0 to N)
  @Prop({ type: Number, default: 1 })
  contractPeriod: number;

  // Must-Win Opportunity Switch
  @Prop({ type: Boolean, default: false })
  isMustWin: boolean;

  @Prop({ type: String, trim: true, maxlength: 2000 })
  scope?: string;

  // Contact Information
  @Prop({ type: String, required: true, trim: true, maxlength: 100 })
  contactFirstName: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 100 })
  contactLastName: string;

  @Prop({ type: String, trim: true, enum: ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.', 'Other'] })
  salutation?: string;

  @Prop({ type: String, enum: ['male', 'female', 'non_binary', 'prefer_not_to_say'] })
  gender?: string;

  @Prop({ type: String, trim: true, maxlength: 150 })
  designation?: string;

  @Prop({ type: String, required: true, trim: true, lowercase: true, maxlength: 150 })
  contactEmail: string;

  @Prop({ type: String, trim: true, maxlength: 50 })
  contactPhone?: string;

  @Prop({ type: Date })
  dateOfBirth?: Date;

  @Prop({ type: String, trim: true, maxlength: 1000 })
  contactDescription?: string;

  @Prop({ type: String, trim: true, maxlength: 250 })
  linkedInUrl?: string;

  @Prop({ type: String, trim: true, maxlength: 100 })
  twitterHandle?: string;

  @Prop({ type: [Object], default: [] })
  contacts?: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    designation?: string;
    isPrimary?: boolean;
    salutation?: string;
    gender?: string;
    linkedInUrl?: string;
    twitterHandle?: string;
  }>;
}

export const LeadSchema = applyBaseSchemaPlugins(SchemaFactory.createForClass(Lead));
LeadSchema.index({ organizationId: 1, status: 1 });
LeadSchema.index({ organizationId: 1, isMustWin: 1 });
LeadSchema.index({ organizationId: 1, leadOwnerId: 1 });
LeadSchema.index({ organizationId: 1, createdAt: -1 });
