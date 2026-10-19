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
import { ContactService } from '../services/contact.service';
import { CreateContactDto, UpdateContactDto } from '../dto/create-contact.dto';

@ApiTags('crm-contacts')
@ApiBearerAuth()
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('organizations/:idOrSlug/crm/contacts')
export class ContactsController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  @ApiOperation({ summary: 'List contacts with optional search and company filter' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by contact name or email' })
  @ApiQuery({ name: 'companyId', required: false, description: 'Filter contacts by company UUID' })
  @ApiResponse({ status: 200, description: 'Contacts retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async list(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Query('search') search?: string,
    @Query('companyId') companyId?: string,
  ) {
    const data = await this.contactService.listContacts(user, idOrSlug, search, companyId);
    return createApiResponse(data, 'Contacts retrieved successfully');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new contact' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiResponse({ status: 201, description: 'Contact created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Body() dto: CreateContactDto,
  ) {
    const data = await this.contactService.createContact(user, idOrSlug, dto);
    return createApiResponse(data, 'Contact created successfully');
  }

  @Get(':contactId')
  @ApiOperation({ summary: 'Get contact details' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiParam({ name: 'contactId', description: 'Contact UUID' })
  @ApiResponse({ status: 200, description: 'Contact details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async get(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('contactId') contactId: string,
  ) {
    const data = await this.contactService.getContact(user, idOrSlug, contactId);
    return createApiResponse(data, 'Contact details retrieved successfully');
  }

  @Patch(':contactId')
  @ApiOperation({ summary: 'Update contact details' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiParam({ name: 'contactId', description: 'Contact UUID' })
  @ApiResponse({ status: 200, description: 'Contact updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('contactId') contactId: string,
    @Body() dto: UpdateContactDto,
  ) {
    const data = await this.contactService.updateContact(user, idOrSlug, contactId, dto);
    return createApiResponse(data, 'Contact updated successfully');
  }

  @Delete(':contactId')
  @ApiOperation({ summary: 'Delete a contact' })
  @ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
  @ApiParam({ name: 'contactId', description: 'Contact UUID' })
  @ApiResponse({ status: 200, description: 'Contact deleted successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async delete(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('contactId') contactId: string,
  ) {
    const data = await this.contactService.deleteContact(user, idOrSlug, contactId);
    return createApiResponse(data, 'Contact deleted successfully');
  }
}
