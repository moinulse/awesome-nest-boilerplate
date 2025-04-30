import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenType } from '../../constants';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { type Uuid } from '../../types';
import { type UserEntity } from '../user/user.entity';
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
  }): Promise<UserEntity> {
    if (payload.type !== TokenType.ACCESS_TOKEN) {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.userService.findOne({
      where: { id: payload.userId },
      relations: ['roles'],
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

    return user;
  }
}
