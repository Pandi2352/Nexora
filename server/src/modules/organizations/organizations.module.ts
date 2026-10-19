import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { Organization, OrganizationSchema } from './schemas/organization.schema';
import { Membership, MembershipSchema } from './schemas/membership.schema';
import { OrganizationsRepository } from './organizations.repository';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';

@Module({
  imports: [
    JwtModule.register({}),
    AuthModule,
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
      { name: Membership.name, schema: MembershipSchema },
    ]),
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsRepository, OrganizationsService],
  exports: [OrganizationsService, OrganizationsRepository],
})
export class OrganizationsModule {}
