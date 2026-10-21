import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, createApiResponse } from '@/common';
import type { JwtPayload } from '../../auth/auth.interface';
import { SupportPermission } from '../constants/support.constants';
import { CreateReplyDto } from '../dto/create-reply.dto';
import { SupportAccessService } from '../services/support-access.service';
import { TicketConversationService } from '../services/ticket-conversation.service';

const TicketIdPipe = new ParseUUIDPipe({ version: '4' });

@ApiTags('support-tickets')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@ApiParam({ name: 'idOrSlug', description: 'Workspace ID or slug' })
@ApiParam({ name: 'ticketId', description: 'Ticket UUID' })
@Controller('organizations/:idOrSlug/support/tickets/:ticketId')
export class TicketConversationController {
  constructor(
    private readonly access: SupportAccessService,
    private readonly conversation: TicketConversationService,
  ) {}

  @Get('replies')
  @ApiOperation({
    summary: 'Conversation: public replies, plus internal notes for staff with write access',
  })
  async listReplies(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('ticketId', TicketIdPipe) ticketId: string,
  ) {
    const ctx = await this.access.resolve(user, idOrSlug, SupportPermission.Read);
    return createApiResponse(
      await this.conversation.listReplies(ctx, ticketId),
      'Replies retrieved',
    );
  }

  @Post('replies')
  @ApiOperation({ summary: 'Post a reply or internal note, optionally setting the status' })
  async addReply(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('ticketId', TicketIdPipe) ticketId: string,
    @Body() dto: CreateReplyDto,
  ) {
    const ctx = await this.access.resolve(user, idOrSlug, SupportPermission.Write);
    const data = await this.conversation.addReply(ctx, ticketId, dto);
    return createApiResponse(
      data,
      dto.type === 'reply' ? 'Reply sent' : 'Internal note added',
      undefined,
      201,
    );
  }

  @Get('events')
  @ApiOperation({ summary: 'Ticket history timeline' })
  async listEvents(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('ticketId', TicketIdPipe) ticketId: string,
  ) {
    const ctx = await this.access.resolve(user, idOrSlug, SupportPermission.Read);
    return createApiResponse(
      await this.conversation.listEvents(ctx, ticketId),
      'History retrieved',
    );
  }
}
