import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import _ from 'lodash';

import { type UserEntity } from '../modules/user/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (_.isEmpty(requiredRoles)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserEntity | undefined;

    // If the user does not have roles, deny access
    if (!user?.roles || user.roles.length === 0) {
      return false;
    }

    // Check if any of the user's roles match the required roles
    return user.roles.some((role) => requiredRoles.includes(role.name));
  }
}
