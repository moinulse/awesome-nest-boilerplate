import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenType } from '../../constants';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { type Uuid } from '../../types';
import { type AuthenticatedUser } from '../../types/auth-user.type';
import { CacheService } from '../cache/cache.service';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ApiConfigService,
    private userService: UserService,
    private cacheService: CacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request) => {
          if (request.cookies?.accessToken) {
            return request.cookies.accessToken;
          }

          return null;
        },
      ]),
      secretOrKey: configService.authConfig.publicKey,
    });
  }

  async validate(payload: {
    userId: Uuid;
    type: TokenType;
  }): Promise<AuthenticatedUser> {
    if (payload.type !== TokenType.ACCESS_TOKEN) {
      throw new UnauthorizedException('Invalid token type');
    }

    const userCacheKey = this.cacheService.getUserKey(payload.userId);

    const cachedUser =
      await this.cacheService.get<AuthenticatedUser>(userCacheKey);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.userService.findOne({
      where: { id: payload.userId },
      relations: ['roles', 'roles.permissions', 'directPermissions'],
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        roles: {
          id: true,
          name: true,
          permissions: {
            id: true,
            name: true,
          },
        },
        directPermissions: {
          id: true,
          name: true,
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
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
    const authenticatedUser = user as AuthenticatedUser;
    authenticatedUser.computedPermissions = allPermissions;

    // Cache the user with computed permissions
    await this.cacheService.set(userCacheKey, authenticatedUser);

    return authenticatedUser;
  }
}
