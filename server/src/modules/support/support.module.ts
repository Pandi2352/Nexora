import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditModule } from '../audit/audit.module';
import { CrmModule } from '../crm/crm.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { UsersModule } from '../users/users.module';
import { TicketConversationController } from './controllers/ticket-conversation.controller';
import { TicketWorkflowController } from './controllers/ticket-workflow.controller';
import { TicketsController } from './controllers/tickets.controller';
import { TicketActivityRepository } from './repositories/ticket-activity.repository';
import { TicketStatsRepository } from './repositories/ticket-stats.repository';
import { TicketRepository } from './repositories/ticket.repository';
import { TicketCounter, TicketCounterSchema } from './schemas/ticket-counter.schema';
import { TicketEvent, TicketEventSchema } from './schemas/ticket-event.schema';
import { TicketReply, TicketReplySchema } from './schemas/ticket-reply.schema';
import { Ticket, TicketSchema } from './schemas/ticket.schema';
import { SupportAccessService } from './services/support-access.service';
import { TicketConversationService } from './services/ticket-conversation.service';
import { TicketHistoryService } from './services/ticket-history.service';
import { TicketWorkflowService } from './services/ticket-workflow.service';
import { TicketService } from './services/ticket.service';

@Module({
  imports: [
    OrganizationsModule,
    UsersModule,
    AuditModule,
    CrmModule,
    MongooseModule.forFeature([
      { name: Ticket.name, schema: TicketSchema },
      { name: TicketReply.name, schema: TicketReplySchema },
      { name: TicketEvent.name, schema: TicketEventSchema },
      { name: TicketCounter.name, schema: TicketCounterSchema },
    ]),
  ],
  controllers: [TicketsController, TicketWorkflowController, TicketConversationController],
  providers: [
    TicketRepository,
    TicketStatsRepository,
    TicketActivityRepository,
    SupportAccessService,
    TicketHistoryService,
    TicketService,
    TicketWorkflowService,
    TicketConversationService,
  ],
})
export class SupportModule {}
