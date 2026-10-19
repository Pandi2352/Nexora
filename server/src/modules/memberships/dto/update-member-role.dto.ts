import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class UpdateMemberRoleDto {
  @ApiProperty({
    description: 'Updated role in workspace',
    enum: ['owner', 'admin', 'manager', 'member', 'support_agent'],
  })
  @IsString()
  @IsIn(['owner', 'admin', 'manager', 'member', 'support_agent'], {
    message: 'Role must be owner, admin, manager, member, or support_agent',
  })
  role: string;
}
