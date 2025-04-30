import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

// Accept role names as strings
export function Auth(
  roles: string[] = [], // Change RoleType[] to string[]
  options?: Partial<{ public: boolean }>,
): MethodDecorator {
  const isPublicRoute = options?.public;

  return applyDecorators(
    SetMetadata('roles', roles), // Store role names (strings)
    UseGuards(AuthGuard({ public: isPublicRoute }), RolesGuard), // Use appropriate guards
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
