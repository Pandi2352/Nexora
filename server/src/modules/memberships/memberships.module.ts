import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { UsersModule } from '../users/users.module';
import { MembershipsService } from './memberships.service';
import { MembershipsController } from './memberships.controller';

@Module({
  imports: [
    JwtModule.register({}),
    AuthModule,
    OrganizationsModule,
    UsersModule,
  ],
  controllers: [MembershipsController],
  providers: [MembershipsService],
  exports: [MembershipsService],
})
export class MembershipsModule {}
