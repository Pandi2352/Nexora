import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from '../schemas/company.schema';

@Injectable()
export class CompanyRepository {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<CompanyDocument>,
  ) {}

  async create(data: Partial<Company>): Promise<CompanyDocument> {
    return this.companyModel.create(data);
  }

  async findById(orgId: string, id: string): Promise<CompanyDocument | null> {
    return this.companyModel.findOne({ _id: id, organizationId: orgId }).exec();
  }

  async list(orgId: string, search?: string): Promise<CompanyDocument[]> {
    const filter: Record<string, unknown> = { organizationId: orgId };
    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { industry: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
      ];
    }
    return this.companyModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async update(orgId: string, id: string, update: Partial<Company>): Promise<CompanyDocument | null> {
    return this.companyModel
      .findOneAndUpdate({ _id: id, organizationId: orgId }, { $set: update }, { new: true })
      .exec();
  }

  async delete(orgId: string, id: string): Promise<boolean> {
    const res = await this.companyModel.deleteOne({ _id: id, organizationId: orgId }).exec();
    return res.deletedCount > 0;
  }

  async count(orgId: string): Promise<number> {
    return this.companyModel.countDocuments({ organizationId: orgId }).exec();
  }
}
