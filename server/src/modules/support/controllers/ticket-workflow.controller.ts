import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, createApiResponse } from '@/common';
import type { JwtPayload } from '../../auth/auth.interface';
import { SupportPermission } from '../constants/support.constants';
import {
  AssignTicketDto,
  ChangeTicketStatusDto,
  ReopenTicketDto,
  ResolveTicketDto,
} from '../dto/ticket-actions.dto';
import { SupportAccessService } from '../services/support-access.service';
import { TicketWorkflowService } from '../services/ticket-workflow.service';

const TicketIdPipe = new ParseUUIDPipe({ version: '4' });

@ApiTags('support-tickets')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
@ApiParam({ name: 'ticketId', description: 'Ticket UUID' })
@ApiResponse({ status: 422, description: 'Transition not allowed from the current status' })
@Controller('organizations/:idOrSlug/support/tickets/:ticketId')
export class TicketWorkflowController {
  constructor(
    private readonly access: SupportAccessService,
    private readonly workflow: TicketWorkflowService,
  ) {}

  @Post('status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change status (validated transitions; resolve and reopen have their own actions)',
  })
  async changeStatus(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('ticketId', TicketIdPipe) ticketId: string,
    @Body() dto: ChangeTicketStatusDto,
  ) {
    const ctx = await this.access.resolve(user, idOrSlug, SupportPermission.Write);
    return createApiResponse(
      await this.workflow.changeStatus(ctx, ticketId, dto),
      'Ticket status updated',
    );
  }

  @Post('assign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign or unassign (others: support managers only)' })
  async assign(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('ticketId', TicketIdPipe) ticketId: string,
    @Body() dto: AssignTicketDto,
  ) {
    const ctx = await this.access.resolve(user, idOrSlug, SupportPermission.Write);
    return createApiResponse(
      await this.workflow.assign(ctx, ticketId, dto),
      'Ticket assignment updated',
    );
  }

  @Post('resolve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resolve with a resolution type and summary' })
  async resolve(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('ticketId', TicketIdPipe) ticketId: string,
    @Body() dto: ResolveTicketDto,
  ) {
    const ctx = await this.access.resolve(user, idOrSlug, SupportPermission.Write);
    return createApiResponse(await this.workflow.resolve(ctx, ticketId, dto), 'Ticket resolved');
  }

  @Post('reopen')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reopen a resolved or closed ticket (restarts the resolution SLA)' })
  async reopen(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('ticketId', TicketIdPipe) ticketId: string,
    @Body() dto: ReopenTicketDto,
  ) {
    const ctx = await this.access.resolve(user, idOrSlug, SupportPermission.Write);
    return createApiResponse(await this.workflow.reopen(ctx, ticketId, dto), 'Ticket reopened');
  }
}
