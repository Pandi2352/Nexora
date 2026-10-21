import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, createApiResponse } from '@/common';
import type { JwtPayload } from '../../auth/auth.interface';
import { SupportPermission } from '../constants/support.constants';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { ListTicketsQueryDto } from '../dto/list-tickets-query.dto';
import { UpdateTicketDto } from '../dto/update-ticket.dto';
import { SupportAccessService } from '../services/support-access.service';
import { TicketService } from '../services/ticket.service';

const TicketIdPipe = new ParseUUIDPipe({ version: '4' });

@ApiTags('support-tickets')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
@Controller('organizations/:idOrSlug/support/tickets')
export class TicketsController {
  constructor(
    private readonly access: SupportAccessService,
    private readonly tickets: TicketService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List tickets with view, filters, search, sort and pagination' })
  @ApiResponse({ status: 200, description: 'Tickets retrieved' })
  async list(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Query() query: ListTicketsQueryDto,
  ) {
    const ctx = await this.access.resolve(user, idOrSlug, SupportPermission.Read);
    const { items, meta } = await this.tickets.list(ctx, query);
    return createApiResponse(items, 'Tickets retrieved', meta);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Queue counts, SLA breaches and response-time averages' })
  async stats(@CurrentUser() user: JwtPayload, @Param('idOrSlug') idOrSlug: string) {
    const ctx = await this.access.resolve(user, idOrSlug, SupportPermission.Read);
    return createApiResponse(await this.tickets.stats(ctx), 'Ticket statistics retrieved');
  }

  @Post()
  @ApiOperation({ summary: 'Create a ticket (SLA due dates are set from its priority)' })
  @ApiResponse({ status: 201, description: 'Ticket created' })
  @ApiResponse({ status: 422, description: 'Assignee or CRM link not valid in this workspace' })
  async create(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Body() dto: CreateTicketDto,
  ) {
    const ctx = await this.access.resolve(user, idOrSlug, SupportPermission.Write);
    return createApiResponse(await this.tickets.create(ctx, dto), 'Ticket created', undefined, 201);
  }

  @Get(':ticketId')
  @ApiOperation({ summary: 'Get a ticket with live SLA state' })
  @ApiParam({ name: 'ticketId', description: 'Ticket UUID' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async get(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('ticketId', TicketIdPipe) ticketId: string,
  ) {
    const ctx = await this.access.resolve(user, idOrSlug, SupportPermission.Read);
    return createApiResponse(await this.tickets.get(ctx, ticketId), 'Ticket retrieved');
  }

  @Patch(':ticketId')
  @ApiOperation({
    summary: 'Edit ticket details (subject, description, priority, category, requester, tags)',
  })
  @ApiParam({ name: 'ticketId', description: 'Ticket UUID' })
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('ticketId', TicketIdPipe) ticketId: string,
    @Body() dto: UpdateTicketDto,
  ) {
    const ctx = await this.access.resolve(user, idOrSlug, SupportPermission.Write);
    return createApiResponse(await this.tickets.update(ctx, ticketId, dto), 'Ticket updated');
  }

  @Delete(':ticketId')
  @ApiOperation({ summary: 'Delete a ticket (soft delete; support managers only)' })
  @ApiParam({ name: 'ticketId', description: 'Ticket UUID' })
  async remove(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('ticketId', TicketIdPipe) ticketId: string,
  ) {
    const ctx = await this.access.resolve(user, idOrSlug, SupportPermission.Manage);
    return createApiResponse(await this.tickets.remove(ctx, ticketId), 'Ticket deleted');
  }
}
