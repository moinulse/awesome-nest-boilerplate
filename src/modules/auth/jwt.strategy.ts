import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenType } from '../../constants';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { type Uuid } from '../../types';
import { type AuthenticatedUser } from '../../types/auth-user.type';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ApiConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.publicKey,
    });
  }

  async validate(payload: {
    userId: Uuid;
    roles: string[];
    type: TokenType;
  }): Promise<AuthenticatedUser> {
    if (payload.type !== TokenType.ACCESS_TOKEN) {
      throw new UnauthorizedException('Invalid token type');
    }

    // Load user with all permissions data for computation
    const user = await this.userService.findOne({
      where: { id: payload.userId },
      relations: ['roles', 'roles.permissions', 'directPermissions'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const hasValidRoles = payload.roles.every((role) =>
      user.roles.some((userRole) => userRole.name === role),
    );

    if (!hasValidRoles) {
      throw new UnauthorizedException('User roles do not match token roles');
    }

    // Compute all permissions (from roles + direct permissions)
    const rolePermissions = user.roles.flatMap((role) =>
      role.permissions.map((p) => p.name),
    );

    const directPermissions = user.directPermissions?.map((p) => p.name) || [];

    // Combine and deduplicate permissions
    const allPermissions = [
      ...new Set([...rolePermissions, ...directPermissions]),
    ];

    // Attach computed permissions to user object
    (user as AuthenticatedUser).computedPermissions = allPermissions;

    return user as AuthenticatedUser;
  }
}
