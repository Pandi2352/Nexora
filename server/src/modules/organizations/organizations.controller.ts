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
import { OrganizationsService } from './organizations.service';
import {
  CreateOrganizationDto,
  TransferOwnershipDto,
  UpdateOrganizationDto,
} from './dto';

@ApiTags('organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly orgService: OrganizationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new multi-tenant organization' })
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateOrganizationDto,
  ) {
    const org = await this.orgService.create(user.sub, dto);
    return createApiResponse(org, 'Workspace created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'List organizations where user has active membership' })
  async list(@CurrentUser() user: JwtPayload) {
    const orgs = await this.orgService.listUserOrganizations(user.sub);
    return createApiResponse(orgs, 'Workspaces retrieved successfully');
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get workspace details by ID or slug' })
  async getOne(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
  ) {
    const org = await this.orgService.getByIdOrSlug(user.sub, idOrSlug);
    return createApiResponse(org, 'Workspace retrieved successfully');
  }

  @Patch(':idOrSlug')
  @ApiOperation({ summary: 'Update workspace settings (owners & admins only)' })
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Body() dto: UpdateOrganizationDto,
  ) {
    const org = await this.orgService.update(user.sub, idOrSlug, dto);
    return createApiResponse(org, 'Workspace updated successfully');
  }

  @Post(':idOrSlug/transfer-ownership')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Transfer workspace ownership to another member (Owner only)' })
  async transferOwnership(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Body() dto: TransferOwnershipDto,
  ) {
    const result = await this.orgService.transferOwnership(user.sub, idOrSlug, dto);
    return createApiResponse(result, result.message);
  }

  @Delete(':idOrSlug')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete workspace (Owner only)' })
  async delete(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
  ) {
    const result = await this.orgService.delete(user.sub, idOrSlug);
    return createApiResponse(result, result.message);
  }

  @Post(':idOrSlug/leave')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Leave a workspace (non-sole owners)' })
  async leave(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
  ) {
    const result = await this.orgService.leave(user.sub, idOrSlug);
    return createApiResponse(result, result.message);
  }
}
