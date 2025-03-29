import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import _ from 'lodash';

import { type RoleType } from '../constants';
import { type UserEntity } from '../modules/user/user.entity';
import { RbacService } from '../modules/rbac/rbac.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rbacService: RbacService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<RoleType[]>('roles', context.getHandler());
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (_.isEmpty(roles) && _.isEmpty(permissions)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = <UserEntity>request.user;

    if (roles && roles.includes(user.role)) {
      return true;
    }

    if (permissions) {
      for (const permission of permissions) {
        const hasPermission = await this.rbacService.checkPermission(
          user,
          permission,
        );
        if (hasPermission) {
          return true;
        }
      }
    }

    return false;
  }
}
