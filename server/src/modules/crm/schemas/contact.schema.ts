import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { BaseDocument, defaultSchemaOptions, applyBaseSchemaPlugins } from '@/database/base.schema';

export type ContactDocument = HydratedDocument<Contact>;

@Schema({ ...defaultSchemaOptions, collection: 'contacts' })
export class Contact extends BaseDocument {
  @Prop({ type: String, required: true, index: true })
  organizationId: string;

  @Prop({ type: String, index: true })
  companyId?: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 100 })
  firstName: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 100 })
  lastName: string;

  @Prop({ type: String, trim: true, enum: ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.', 'Other'] })
  salutation?: string;

  @Prop({ type: String, enum: ['male', 'female', 'non_binary', 'prefer_not_to_say'] })
  gender?: string;

  @Prop({ type: String, trim: true, maxlength: 150 })
  designation?: string;

  @Prop({ type: String, required: true, trim: true, lowercase: true, maxlength: 150 })
  email: string;

  @Prop({ type: String, trim: true, maxlength: 50 })
  phone?: string;

  @Prop({ type: Date })
  dateOfBirth?: Date;

  @Prop({ type: String, trim: true, maxlength: 1000 })
  description?: string;

  @Prop({ type: String, trim: true, maxlength: 250 })
  linkedInUrl?: string;

  @Prop({ type: String, trim: true, maxlength: 100 })
  twitterHandle?: string;

  @Prop({ type: Boolean, default: false })
  isPrimary: boolean;
}

export const ContactSchema = applyBaseSchemaPlugins(SchemaFactory.createForClass(Contact));
ContactSchema.index({ organizationId: 1, email: 1 });
ContactSchema.index({ organizationId: 1, companyId: 1 });
ContactSchema.index({ organizationId: 1, createdAt: -1 });
