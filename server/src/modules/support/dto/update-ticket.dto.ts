import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateTicketDto } from './create-ticket.dto';

/**
 * Editable ticket fields. Status, assignee and resolution change through the
 * workflow endpoints so every change is validated and recorded in history.
 */
export class UpdateTicketDto extends PartialType(
  OmitType(CreateTicketDto, ['assigneeId'] as const),
) {}
