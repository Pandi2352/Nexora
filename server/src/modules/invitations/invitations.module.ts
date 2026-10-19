import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from '@/integrations/email';
import { AuthModule } from '../auth/auth.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { UsersModule } from '../users/users.module';
import { Invitation, InvitationSchema } from './schemas/invitation.schema';
import { InvitationsRepository } from './invitations.repository';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';

@Module({
  imports: [
    JwtModule.register({}),
    AuthModule,
    OrganizationsModule,
    UsersModule,
    EmailModule,
    MongooseModule.forFeature([{ name: Invitation.name, schema: InvitationSchema }]),
  ],
  controllers: [InvitationsController],
  providers: [InvitationsRepository, InvitationsService],
  exports: [InvitationsService, InvitationsRepository],
})
export class InvitationsModule {}
