import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsString } from 'class-validator';

export class CreateInvitationDto {
  @ApiProperty({ description: 'Invitee email address', example: 'colleague@company.com' })
  @IsEmail({}, { message: 'A valid email address is required' })
  email: string;

  @ApiProperty({
    description: 'Assigned role in workspace',
    example: 'member',
    enum: ['admin', 'manager', 'member', 'support_agent'],
  })
  @IsString()
  @IsIn(['admin', 'manager', 'member', 'support_agent'], {
    message: 'Role must be admin, manager, member, or support_agent',
  })
  role: string;
}
