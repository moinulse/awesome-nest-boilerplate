import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PERMISSIONS_KEY } from '../decorators/http.decorators';
import { IAMService } from '../modules/iam/iam.service';
import { type UserEntity } from '../modules/user/user.entity';

@Injectable()
export class RBACGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private iamService: IAMService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: UserEntity | undefined = request.user;

    if (!user?.id) {
      throw new ForbiddenException('User not authenticated');
    }

    const userPermissions = await this.iamService.getPermissionsForUser(
      user.id,
    );
    const userPermissionSet = new Set(userPermissions);

    // Check if the user has *all* the required permissions
    const hasAllRequiredPermissions = requiredPermissions.every((permission) =>
      userPermissionSet.has(permission),
    );

    if (!hasAllRequiredPermissions) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
