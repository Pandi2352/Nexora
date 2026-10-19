import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './schemas/team.schema';
import { TeamMembership, TeamMembershipSchema } from './schemas/team-membership.schema';
import { TeamsRepository } from './teams.repository';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { OrganizationsModule } from '../organizations/organizations.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Team.name, schema: TeamSchema },
      { name: TeamMembership.name, schema: TeamMembershipSchema },
    ]),
    OrganizationsModule,
    UsersModule,
  ],
  controllers: [TeamsController],
  providers: [TeamsRepository, TeamsService],
  exports: [TeamsRepository, TeamsService],
})
export class TeamsModule {}
