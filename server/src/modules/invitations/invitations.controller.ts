import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, Public, createApiResponse } from '@/common';
import type { JwtPayload } from '../auth/auth.interface';
import { InvitationsService } from './invitations.service';
import { AcceptInvitationDto, CreateInvitationDto } from './dto';

@ApiTags('invitations')
@Controller()
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Public()
  @Post('invitations/accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Accept an invitation using an email token' })
  async accept(
    @Body() dto: AcceptInvitationDto,
    @CurrentUser() user?: JwtPayload,
  ) {
    const result = await this.invitationsService.accept(dto, user);
    return createApiResponse(result, result.message);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('organizations/:idOrSlug/invitations')
  @ApiOperation({ summary: 'Send workspace membership invitation' })
  async invite(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Body() dto: CreateInvitationDto,
  ) {
    const invite = await this.invitationsService.invite(user, idOrSlug, dto);
    return createApiResponse(invite, 'Invitation dispatched successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('organizations/:idOrSlug/invitations')
  @ApiOperation({ summary: 'List pending invitations for workspace' })
  async listPending(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
  ) {
    const invites = await this.invitationsService.listPending(user, idOrSlug);
    return createApiResponse(invites, 'Pending invitations retrieved');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('organizations/:idOrSlug/invitations/:inviteId')
  @ApiOperation({ summary: 'Revoke pending workspace invitation' })
  async revoke(
    @CurrentUser() user: JwtPayload,
    @Param('idOrSlug') idOrSlug: string,
    @Param('inviteId') inviteId: string,
  ) {
    const result = await this.invitationsService.revoke(user, idOrSlug, inviteId);
    return createApiResponse(result, result.message);
  }
}
