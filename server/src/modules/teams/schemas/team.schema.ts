import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { BaseDocument } from '@/database/base.schema';

export type TeamDocument = HydratedDocument<Team>;

@Schema({ collection: 'teams', timestamps: true, versionKey: false })
export class Team extends BaseDocument {
  @Prop({ type: String, required: true, index: true })
  organizationId: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ type: String, trim: true, maxlength: 500 })
  description?: string;

  @Prop({ type: String, index: true })
  leadUserId?: string;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
TeamSchema.index({ organizationId: 1, name: 1 }, { unique: true });
TeamSchema.index({ organizationId: 1, createdAt: -1 });
