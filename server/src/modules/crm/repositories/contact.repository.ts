import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from '../schemas/contact.schema';

@Injectable()
export class ContactRepository {
  constructor(
    @InjectModel(Contact.name) private readonly contactModel: Model<ContactDocument>,
  ) {}

  async create(data: Partial<Contact>): Promise<ContactDocument> {
    return this.contactModel.create(data);
  }

  async findById(orgId: string, id: string): Promise<ContactDocument | null> {
    return this.contactModel.findOne({ _id: id, organizationId: orgId }).exec();
  }

  async list(orgId: string, search?: string, companyId?: string): Promise<ContactDocument[]> {
    const filter: Record<string, unknown> = { organizationId: orgId };
    if (companyId) {
      filter.companyId = companyId;
    }
    if (search && search.trim()) {
      filter.$or = [
        { firstName: { $regex: search.trim(), $options: 'i' } },
        { lastName: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { designation: { $regex: search.trim(), $options: 'i' } },
      ];
    }
    return this.contactModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async update(orgId: string, id: string, update: Partial<Contact>): Promise<ContactDocument | null> {
    return this.contactModel
      .findOneAndUpdate({ _id: id, organizationId: orgId }, { $set: update }, { new: true })
      .exec();
  }

  async delete(orgId: string, id: string): Promise<boolean> {
    const res = await this.contactModel.deleteOne({ _id: id, organizationId: orgId }).exec();
    return res.deletedCount > 0;
  }

  async count(orgId: string): Promise<number> {
    return this.contactModel.countDocuments({ organizationId: orgId }).exec();
  }
}
