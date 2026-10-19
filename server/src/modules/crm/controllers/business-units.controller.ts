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
import { BusinessUnitService } from '../services/business-unit.service';
import {
  CreateBusinessUnitDto,
  UpdateBusinessUnitDto,
} from '../dto/create-business-unit.dto';

@ApiTags('crm-business-units')
@ApiBearerAuth()
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('organizations/:idOrSlug/crm/business-units')
export class BusinessUnitsController {
  constructor(private readonly buService: BusinessUnitService) {}

  @Get()
  @ApiOperation({ summary: 'List business units for organization' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiQuery({ name: 'includeInactive', required: false, description: 'Include inactive units ("true"/"false")' })
  @ApiResponse({ status: 200, description: 'Business units retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async list(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Query('includeInactive') includeInactive?: string,
  ) {
    const data = await this.buService.listBusinessUnits(
      user,
      idOrSlug,
      includeInactive === 'true',
    );
    return createApiResponse(data, 'Business units retrieved successfully');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new business unit master' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiResponse({ status: 201, description: 'Business unit created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Body() dto: CreateBusinessUnitDto,
  ) {
    const data = await this.buService.createBusinessUnit(user, idOrSlug, dto);
    return createApiResponse(data, 'Business unit created successfully');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing business unit' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiParam({ name: 'id', description: 'Business unit UUID' })
  @ApiResponse({ status: 200, description: 'Business unit updated successfully' })
  @ApiResponse({ status: 404, description: 'Business unit not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('id') id: string,
    @Body() dto: UpdateBusinessUnitDto,
  ) {
    const data = await this.buService.updateBusinessUnit(user, idOrSlug, id, dto);
    return createApiResponse(data, 'Business unit updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a business unit' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiParam({ name: 'id', description: 'Business unit UUID' })
  @ApiResponse({ status: 200, description: 'Business unit deleted successfully' })
  @ApiResponse({ status: 404, description: 'Business unit not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('id') id: string,
  ) {
    const data = await this.buService.deleteBusinessUnit(user, idOrSlug, id);
    return createApiResponse(data, 'Business unit deleted successfully');
  }
}
