import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, type UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  async create(data: Partial<User>): Promise<UserDocument> {
    const user = new this.userModel(data);
    return user.save();
  }

  async update(id: string, updates: Partial<User>): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).exec();
  }

  async count(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }
}
