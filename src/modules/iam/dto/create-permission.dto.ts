import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    description:
      'The unique name of the permission (e.g., "read:users", "update:settings")',
    example: 'create:post',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    description: 'A brief description of what the permission allows',
    example: 'Allows creating new blog posts',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
