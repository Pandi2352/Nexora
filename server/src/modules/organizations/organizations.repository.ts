import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Organization,
  type OrganizationDocument,
  OrganizationStatus,
} from './schemas/organization.schema';
import {
  Membership,
  type MembershipDocument,
  MembershipRole,
  MembershipStatus,
} from './schemas/membership.schema';

@Injectable()
export class OrganizationsRepository {
  constructor(
    @InjectModel(Organization.name)
    private readonly orgModel: Model<OrganizationDocument>,
    @InjectModel(Membership.name)
    private readonly membershipModel: Model<MembershipDocument>,
  ) {}

  async createOrganization(data: Partial<Organization>): Promise<OrganizationDocument> {
    const org = new this.orgModel(data);
    return org.save();
  }

  async findOrgById(id: string): Promise<OrganizationDocument | null> {
    return this.orgModel.findOne({ _id: id, status: { $ne: OrganizationStatus.Deleted } }).exec();
  }

  async findOrgBySlug(slug: string): Promise<OrganizationDocument | null> {
    return this.orgModel
      .findOne({ slug: slug.toLowerCase().trim(), status: { $ne: OrganizationStatus.Deleted } })
      .exec();
  }

  async findOrgByIdOrSlug(idOrSlug: string): Promise<OrganizationDocument | null> {
    return this.orgModel
      .findOne({
        $or: [{ _id: idOrSlug }, { slug: idOrSlug.toLowerCase().trim() }],
        status: { $ne: OrganizationStatus.Deleted },
      })
      .exec();
  }

  async updateOrganization(
    id: string,
    updates: Partial<Organization>,
  ): Promise<OrganizationDocument | null> {
    return this.orgModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).exec();
  }

  async createMembership(data: Partial<Membership>): Promise<MembershipDocument> {
    const membership = new this.membershipModel(data);
    return membership.save();
  }

  async findMembership(
    organizationId: string,
    userId: string,
  ): Promise<MembershipDocument | null> {
    return this.membershipModel.findOne({ organizationId, userId }).exec();
  }

  async findUserMemberships(
    userId: string,
    status = MembershipStatus.Active,
  ): Promise<MembershipDocument[]> {
    return this.membershipModel
      .find({ userId, status })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOrgMemberships(organizationId: string): Promise<MembershipDocument[]> {
    return this.membershipModel
      .find({ organizationId, status: MembershipStatus.Active })
      .sort({ createdAt: 1 })
      .exec();
  }

  async countMembers(organizationId: string): Promise<number> {
    return this.membershipModel.countDocuments({
      organizationId,
      status: MembershipStatus.Active,
    }).exec();
  }

  async countOwners(organizationId: string): Promise<number> {
    return this.membershipModel.countDocuments({
      organizationId,
      role: MembershipRole.Owner,
      status: MembershipStatus.Active,
    }).exec();
  }

  async removeMembership(organizationId: string, userId: string): Promise<boolean> {
    const res = await this.membershipModel.deleteOne({ organizationId, userId }).exec();
    return (res.deletedCount ?? 0) > 0;
  }
}
