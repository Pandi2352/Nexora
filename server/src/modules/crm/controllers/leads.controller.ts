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
import { LeadService } from '../services/lead.service';
import { CreateLeadDto, UpdateLeadDto } from '../dto/create-lead.dto';

@ApiTags('crm-leads')
@ApiBearerAuth()
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('organizations/:idOrSlug/crm/leads')
export class LeadsController {
  constructor(private readonly leadService: LeadService) {}

  @Get()
  @ApiOperation({ summary: 'List leads with filtering options' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiQuery({ name: 'search', required: false, description: 'Search company, contact name, or email' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by lead status' })
  @ApiQuery({ name: 'leadOwnerId', required: false, description: 'Filter by owner user ID' })
  @ApiQuery({ name: 'businessUnit', required: false, description: 'Filter by business unit' })
  @ApiQuery({ name: 'isMustWin', required: false, description: 'Filter must-win deals only (true/false)' })
  @ApiResponse({ status: 200, description: 'Leads retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async list(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('leadOwnerId') leadOwnerId?: string,
    @Query('businessUnit') businessUnit?: string,
    @Query('isMustWin') isMustWin?: string,
  ) {
    const data = await this.leadService.listLeads(user, idOrSlug, {
      search,
      status,
      leadOwnerId,
      businessUnit,
      isMustWin: isMustWin !== undefined ? isMustWin === 'true' : undefined,
    });
    return createApiResponse(data, 'Leads retrieved successfully');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new lead with lead details, funnel, and contact information' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiResponse({ status: 201, description: 'Lead created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Body() dto: CreateLeadDto,
  ) {
    const data = await this.leadService.createLead(user, idOrSlug, dto);
    return createApiResponse(data, 'Lead created successfully');
  }

  @Get(':leadId')
  @ApiOperation({ summary: 'Get lead details' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiParam({ name: 'leadId', description: 'Lead UUID' })
  @ApiResponse({ status: 200, description: 'Lead details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  async get(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('leadId') leadId: string,
  ) {
    const data = await this.leadService.getLead(user, idOrSlug, leadId);
    return createApiResponse(data, 'Lead details retrieved successfully');
  }

  @Patch(':leadId')
  @ApiOperation({ summary: 'Update lead details' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiParam({ name: 'leadId', description: 'Lead UUID' })
  @ApiResponse({ status: 200, description: 'Lead updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('leadId') leadId: string,
    @Body() dto: UpdateLeadDto,
  ) {
    const data = await this.leadService.updateLead(user, idOrSlug, leadId, dto);
    return createApiResponse(data, 'Lead updated successfully');
  }

  @Post(':leadId/convert')
  @ApiOperation({ summary: 'Convert lead into company, contact, and deal opportunity' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiParam({ name: 'leadId', description: 'Lead UUID' })
  @ApiResponse({ status: 201, description: 'Lead converted into account, contact, and opportunity successfully' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  async convert(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('leadId') leadId: string,
  ) {
    const data = await this.leadService.convertLead(user, idOrSlug, leadId);
    return createApiResponse(data, 'Lead converted into account, contact, and opportunity successfully');
  }

  @Delete(':leadId')
  @ApiOperation({ summary: 'Delete a lead' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiParam({ name: 'leadId', description: 'Lead UUID' })
  @ApiResponse({ status: 200, description: 'Lead deleted successfully' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  async delete(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('leadId') leadId: string,
  ) {
    const data = await this.leadService.deleteLead(user, idOrSlug, leadId);
    return createApiResponse(data, 'Lead deleted successfully');
  }
}
