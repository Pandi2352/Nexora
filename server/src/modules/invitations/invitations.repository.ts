import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Invitation,
  type InvitationDocument,
  InvitationStatus,
} from './schemas/invitation.schema';

@Injectable()
export class InvitationsRepository {
  constructor(
    @InjectModel(Invitation.name)
    private readonly invitationModel: Model<InvitationDocument>,
  ) {}

  async create(data: Partial<Invitation>): Promise<InvitationDocument> {
    const invite = new this.invitationModel(data);
    return invite.save();
  }

  async findById(id: string): Promise<InvitationDocument | null> {
    return this.invitationModel.findById(id).exec();
  }

  async findByTokenHash(tokenHash: string): Promise<InvitationDocument | null> {
    return this.invitationModel.findOne({ tokenHash }).exec();
  }

  async findPendingByOrgAndEmail(
    organizationId: string,
    email: string,
  ): Promise<InvitationDocument | null> {
    return this.invitationModel
      .findOne({
        organizationId,
        email: email.toLowerCase().trim(),
        status: InvitationStatus.Pending,
        expiresAt: { $gt: new Date() },
      })
      .exec();
  }

  async findPendingByOrg(organizationId: string): Promise<InvitationDocument[]> {
    return this.invitationModel
      .find({
        organizationId,
        status: InvitationStatus.Pending,
        expiresAt: { $gt: new Date() },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(id: string, updates: Partial<Invitation>): Promise<InvitationDocument | null> {
    return this.invitationModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.invitationModel.deleteOne({ _id: id }).exec();
    return (res.deletedCount ?? 0) > 0;
  }
}
