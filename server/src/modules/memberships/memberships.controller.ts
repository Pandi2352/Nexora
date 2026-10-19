import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, createApiResponse } from '@/common';
import type { JwtPayload } from '../auth/auth.interface';
import { MembershipsService } from './memberships.service';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

@ApiTags('memberships')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organizations/:idOrSlug/members')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Get()
  @ApiOperation({ summary: 'List active members of a workspace' })
  async list(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
  ) {
    const members = await this.membershipsService.listMembers(user, idOrSlug);
    return createApiResponse(members, 'Workspace members retrieved');
  }

  @Patch(':memberId/role')
  @ApiOperation({ summary: 'Update a member role (Owner/Admin only)' })
  async updateRole(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('memberId') memberId: string,
    @Body() dto: UpdateMemberRoleDto,
  ) {
    const updated = await this.membershipsService.updateRole(
      user,
      idOrSlug,
      memberId,
      dto.role,
    );
    return createApiResponse(updated, 'Member role updated successfully');
  }

  @Delete(':memberId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a member from the workspace' })
  async remove(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('memberId') memberId: string,
  ) {
    const result = await this.membershipsService.removeMember(user, idOrSlug, memberId);
    return createApiResponse(result, result.message);
  }
}
