import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { BaseDocument } from '@/database/base.schema';

export type UserDocument = HydratedDocument<User>;

export enum UserStatus {
  Active = 'active',
  Suspended = 'suspended',
  Disabled = 'disabled',
}

@Schema({ collection: 'users', timestamps: true, versionKey: false })
export class User extends BaseDocument {
  @Prop({ type: String, required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ type: String, trim: true })
  avatarUrl?: string;

  @Prop({ type: String, default: 'UTC', trim: true })
  timezone: string;

  @Prop({ type: String, default: 'en-US', trim: true })
  locale: string;

  @Prop({ type: Boolean, default: false })
  isEmailVerified: boolean;

  @Prop({ type: String, enum: Object.values(UserStatus), default: UserStatus.Active, index: true })
  status: UserStatus;

  @Prop({ type: Boolean, default: false, index: true })
  isPlatformAdmin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ status: 1 });
UserSchema.index({ createdAt: -1 });
