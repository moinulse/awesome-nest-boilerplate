import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateRoleDto {
  @ApiPropertyOptional({
    description: 'The updated name of the role',
    example: 'Moderator',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'The updated description of the role',
    example: 'Manages user comments',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description:
      'List of permission IDs to set for this role (replaces existing)',
    type: [String],
    format: 'uuid',
    example: [
      'c4e8f2a9-9e1d-4b7f-9c6a-4d0e2b1a3c5e',
      'd5f9a3b0-0f2e-5c8a-ad7b-5e1f5b2c4d6f',
    ],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  permissionIds?: string[];
}
