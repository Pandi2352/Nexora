import { Injectable } from '@nestjs/common';
import { User, type UserDocument } from './schemas/user.schema';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findById(id: string): Promise<UserDocument | null> {
    return this.usersRepository.findById(id);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.usersRepository.findByEmail(email);
  }

  async create(data: Partial<User>): Promise<UserDocument> {
    return this.usersRepository.create(data);
  }

  async update(id: string, updates: Partial<User>): Promise<UserDocument | null> {
    return this.usersRepository.update(id, updates);
  }

  async markEmailVerified(id: string): Promise<UserDocument | null> {
    return this.usersRepository.update(id, { isEmailVerified: true });
  }

  async updatePassword(id: string, passwordHash: string): Promise<UserDocument | null> {
    return this.usersRepository.update(id, { passwordHash });
  }
}
