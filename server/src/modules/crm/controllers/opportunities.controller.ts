import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, createApiResponse } from '@/common';
import type { JwtPayload } from '../../auth/auth.interface';
import { OpportunityService } from '../services/opportunity.service';
import {
  CreateOpportunityDto,
  UpdateOpportunityDto,
  UpdateOpportunityStageDto,
} from '../dto/create-opportunity.dto';

@ApiTags('crm-opportunities')
@ApiBearerAuth()
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('organizations/:idOrSlug/crm/opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunityService: OpportunityService) {}

  @Get()
  @ApiOperation({ summary: 'List deals and opportunities with stage filtering' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiQuery({ name: 'stage', required: false, description: 'Filter by pipeline stage' })
  @ApiQuery({ name: 'companyId', required: false, description: 'Filter by company UUID' })
  @ApiQuery({ name: 'ownerId', required: false, description: 'Filter by owner UUID' })
  @ApiQuery({ name: 'isMustWin', required: false, description: 'Filter by must-win flag ("true"/"false")' })
  @ApiResponse({ status: 200, description: 'Opportunities retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async list(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Query('stage') stage?: string,
    @Query('companyId') companyId?: string,
    @Query('ownerId') ownerId?: string,
    @Query('isMustWin') isMustWin?: string,
  ) {
    const data = await this.opportunityService.listOpportunities(user, idOrSlug, {
      stage,
      companyId,
      ownerId,
      isMustWin: isMustWin !== undefined ? isMustWin === 'true' : undefined,
    });
    return createApiResponse(data, 'Opportunities retrieved successfully');
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get pipeline value and stage summary metrics' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiResponse({ status: 200, description: 'Pipeline summary retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getSummary(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
  ) {
    const data = await this.opportunityService.getPipelineSummary(user, idOrSlug);
    return createApiResponse(data, 'Pipeline summary retrieved successfully');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new opportunity / quotation' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiResponse({ status: 201, description: 'Opportunity created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Body() dto: CreateOpportunityDto,
  ) {
    const data = await this.opportunityService.createOpportunity(user, idOrSlug, dto);
    return createApiResponse(data, 'Opportunity created successfully');
  }

  @Get(':oppId')
  @ApiOperation({ summary: 'Get opportunity details' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiParam({ name: 'oppId', description: 'Opportunity UUID' })
  @ApiResponse({ status: 200, description: 'Opportunity retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Opportunity not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async get(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('oppId') oppId: string,
  ) {
    const data = await this.opportunityService.getOpportunity(user, idOrSlug, oppId);
    return createApiResponse(data, 'Opportunity retrieved successfully');
  }

  @Patch(':oppId')
  @ApiOperation({ summary: 'Update opportunity details' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiParam({ name: 'oppId', description: 'Opportunity UUID' })
  @ApiResponse({ status: 200, description: 'Opportunity updated successfully' })
  @ApiResponse({ status: 404, description: 'Opportunity not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('oppId') oppId: string,
    @Body() dto: UpdateOpportunityDto,
  ) {
    const data = await this.opportunityService.updateOpportunity(user, idOrSlug, oppId, dto);
    return createApiResponse(data, 'Opportunity updated successfully');
  }

  @Patch(':oppId/stage')
  @ApiOperation({ summary: 'Update opportunity pipeline stage (drag and drop)' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiParam({ name: 'oppId', description: 'Opportunity UUID' })
  @ApiResponse({ status: 200, description: 'Stage updated successfully' })
  @ApiResponse({ status: 404, description: 'Opportunity not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateStage(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('oppId') oppId: string,
    @Body() dto: UpdateOpportunityStageDto,
  ) {
    const data = await this.opportunityService.updateStage(user, idOrSlug, oppId, dto);
    return createApiResponse(data, 'Stage updated successfully');
  }

  @Delete(':oppId')
  @ApiOperation({ summary: 'Delete an opportunity' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiParam({ name: 'oppId', description: 'Opportunity UUID' })
  @ApiResponse({ status: 200, description: 'Opportunity deleted successfully' })
  @ApiResponse({ status: 404, description: 'Opportunity not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('oppId') oppId: string,
  ) {
    const data = await this.opportunityService.deleteOpportunity(user, idOrSlug, oppId);
    return createApiResponse(data, 'Opportunity deleted successfully');
  }
}
