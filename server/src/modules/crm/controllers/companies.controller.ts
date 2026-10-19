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
import { CompanyService } from '../services/company.service';
import { CreateCompanyDto, UpdateCompanyDto } from '../dto/create-company.dto';

@ApiTags('crm-companies')
@ApiBearerAuth()
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('organizations/:idOrSlug/crm/companies')
export class CompaniesController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @ApiOperation({ summary: 'List all companies in a workspace' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiQuery({ name: 'search', required: false, description: 'Filter companies by name or website' })
  @ApiResponse({ status: 200, description: 'Companies retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async list(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Query('search') search?: string,
  ) {
    const data = await this.companyService.listCompanies(user, idOrSlug, search);
    return createApiResponse(data, 'Companies retrieved successfully');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new company' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiResponse({ status: 201, description: 'Company created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Body() dto: CreateCompanyDto,
  ) {
    const data = await this.companyService.createCompany(user, idOrSlug, dto);
    return createApiResponse(data, 'Company created successfully');
  }

  @Get(':companyId')
  @ApiOperation({ summary: 'Get company details with linked contacts & opportunities' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiParam({ name: 'companyId', description: 'Company UUID' })
  @ApiResponse({ status: 200, description: 'Company details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async get(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('companyId') companyId: string,
  ) {
    const data = await this.companyService.getCompany(user, idOrSlug, companyId);
    return createApiResponse(data, 'Company details retrieved successfully');
  }

  @Patch(':companyId')
  @ApiOperation({ summary: 'Update company details' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiParam({ name: 'companyId', description: 'Company UUID' })
  @ApiResponse({ status: 200, description: 'Company updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('companyId') companyId: string,
    @Body() dto: UpdateCompanyDto,
  ) {
    const data = await this.companyService.updateCompany(user, idOrSlug, companyId, dto);
    return createApiResponse(data, 'Company updated successfully');
  }

  @Delete(':companyId')
  @ApiOperation({ summary: 'Delete a company' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiParam({ name: 'companyId', description: 'Company UUID' })
  @ApiResponse({ status: 200, description: 'Company deleted successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async delete(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('companyId') companyId: string,
  ) {
    const data = await this.companyService.deleteCompany(user, idOrSlug, companyId);
    return createApiResponse(data, 'Company deleted successfully');
  }
}
