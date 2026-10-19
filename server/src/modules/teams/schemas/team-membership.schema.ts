import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { BaseDocument } from '@/database/base.schema';

export type TeamMembershipDocument = HydratedDocument<TeamMembership>;

@Schema({ collection: 'team_memberships', timestamps: true, versionKey: false })
export class TeamMembership extends BaseDocument {
  @Prop({ type: String, required: true, index: true })
  organizationId: string;

  @Prop({ type: String, required: true, index: true })
  teamId: string;

  @Prop({ type: String, required: true, index: true })
  userId: string;

  @Prop({ type: Date, default: () => new Date() })
  joinedAt: Date;
}

export const TeamMembershipSchema = SchemaFactory.createForClass(TeamMembership);
TeamMembershipSchema.index({ organizationId: 1, teamId: 1, userId: 1 }, { unique: true });
TeamMembershipSchema.index({ organizationId: 1, userId: 1 });
TeamMembershipSchema.index({ organizationId: 1, teamId: 1 });
