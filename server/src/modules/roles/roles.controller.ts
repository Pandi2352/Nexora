import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, createApiResponse } from '@/common';
import type { JwtPayload } from '../auth/auth.interface';
import { RolesService } from './roles.service';

@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organizations/:idOrSlug/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'List all workspace roles with member counts' })
  async getRoles(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
  ) {
    const roles = await this.rolesService.getRoles(user, idOrSlug);
    return createApiResponse(roles, 'Workspace roles retrieved');
  }

  @Get('matrix')
  @ApiOperation({ summary: 'Get the comparative roles and permissions matrix' })
  async getMatrix(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
  ) {
    const matrix = await this.rolesService.getPermissionsMatrix(user, idOrSlug);
    return createApiResponse(matrix, 'Permission matrix retrieved');
  }

  @Get('me')
  @ApiOperation({ summary: 'Get effective permissions for the current user' })
  async getMyPermissions(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
  ) {
    const perms = await this.rolesService.getUserPermissions(user, idOrSlug);
    return createApiResponse(perms, 'Current user permissions retrieved');
  }
}
