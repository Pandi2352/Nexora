import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class AddTeamMembersDto {
  @ApiProperty({
    example: ['a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'],
    description: 'Array of user UUIDs to add to the team',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  userIds: string[];
}
