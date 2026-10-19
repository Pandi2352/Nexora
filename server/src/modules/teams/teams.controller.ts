import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, createApiResponse } from '@/common';
import type { JwtPayload } from '../auth/auth.interface';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMembersDto } from './dto/manage-team-members.dto';

@ApiTags('teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organizations/:idOrSlug/teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @ApiOperation({ summary: 'List all teams in a workspace' })
  async list(@CurrentUser() user: JwtPayload, @Param('idOrSlug') idOrSlug: string) {
    const teams = await this.teamsService.listTeams(user, idOrSlug);
    return createApiResponse(teams, 'Teams retrieved');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new team' })
  async create(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Body() dto: CreateTeamDto,
  ) {
    const team = await this.teamsService.createTeam(user, idOrSlug, dto);
    return createApiResponse(team, 'Team created successfully');
  }

  @Get(':teamId')
  @ApiOperation({ summary: 'Get team details and members' })
  async get(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('teamId') teamId: string,
  ) {
    const team = await this.teamsService.getTeam(user, idOrSlug, teamId);
    return createApiResponse(team, 'Team details retrieved');
  }

  @Patch(':teamId')
  @ApiOperation({ summary: 'Update team details' })
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('teamId') teamId: string,
    @Body() dto: UpdateTeamDto,
  ) {
    const updated = await this.teamsService.updateTeam(user, idOrSlug, teamId, dto);
    return createApiResponse(updated, 'Team updated successfully');
  }

  @Delete(':teamId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a team' })
  async delete(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('teamId') teamId: string,
  ) {
    const res = await this.teamsService.deleteTeam(user, idOrSlug, teamId);
    return createApiResponse(res, 'Team deleted successfully');
  }

  @Post(':teamId/members')
  @ApiOperation({ summary: 'Add members to a team' })
  async addMembers(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('teamId') teamId: string,
    @Body() dto: AddTeamMembersDto,
  ) {
    const updatedTeam = await this.teamsService.addMembers(user, idOrSlug, teamId, dto.userIds);
    return createApiResponse(updatedTeam, 'Team members added');
  }

  @Delete(':teamId/members/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a member from a team' })
  async removeMember(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
  ) {
    const res = await this.teamsService.removeMember(user, idOrSlug, teamId, userId);
    return createApiResponse(res, 'Member removed from team');
  }
}
