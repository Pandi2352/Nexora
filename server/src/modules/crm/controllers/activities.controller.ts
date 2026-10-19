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
import { SalesActivityService } from '../services/activity.service';
import { CreateSalesActivityDto } from '../dto/create-activity.dto';

@ApiTags('crm-activities')
@ApiBearerAuth()
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('organizations/:idOrSlug/crm/activities')
export class ActivitiesController {
  constructor(private readonly activityService: SalesActivityService) {}

  @Get()
  @ApiOperation({ summary: 'List sales activities (cold calls, meetings, proposals)' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by activity type (cold_call, meeting, proposal_submitted, etc.)' })
  @ApiQuery({ name: 'companyId', required: false, description: 'Filter by company UUID' })
  @ApiQuery({ name: 'leadId', required: false, description: 'Filter by lead UUID' })
  @ApiQuery({ name: 'performedById', required: false, description: 'Filter by performer UUID' })
  @ApiResponse({ status: 200, description: 'Activities retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async list(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Query('type') type?: string,
    @Query('companyId') companyId?: string,
    @Query('leadId') leadId?: string,
    @Query('performedById') performedById?: string,
  ) {
    const data = await this.activityService.listActivities(user, idOrSlug, {
      type,
      companyId,
      leadId,
      performedById,
    });
    return createApiResponse(data, 'Activities retrieved successfully');
  }

  @Post()
  @ApiOperation({ summary: 'Log a new sales touchpoint (cold call, meeting, proposal)' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiResponse({ status: 201, description: 'Activity logged successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Body() dto: CreateSalesActivityDto,
  ) {
    const data = await this.activityService.logActivity(user, idOrSlug, dto);
    return createApiResponse(data, 'Activity logged successfully');
  }

  @Patch(':activityId')
  @ApiOperation({ summary: 'Update an existing sales activity or outcome' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiParam({ name: 'activityId', description: 'Activity UUID' })
  @ApiResponse({ status: 200, description: 'Activity updated successfully' })
  @ApiResponse({ status: 404, description: 'Activity not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('activityId') activityId: string,
    @Body() dto: Partial<CreateSalesActivityDto>,
  ) {
    const data = await this.activityService.updateActivity(user, idOrSlug, activityId, dto);
    return createApiResponse(data, 'Activity updated successfully');
  }

  @Delete(':activityId')
  @ApiOperation({ summary: 'Delete a sales activity record' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiParam({ name: 'activityId', description: 'Activity UUID' })
  @ApiResponse({ status: 200, description: 'Activity deleted successfully' })
  @ApiResponse({ status: 404, description: 'Activity not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('activityId') activityId: string,
  ) {
    const data = await this.activityService.deleteActivity(user, idOrSlug, activityId);
    return createApiResponse(data, 'Activity deleted successfully');
  }
}
