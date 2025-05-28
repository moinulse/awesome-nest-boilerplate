import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { TokenType } from '../../constants';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { Uuid } from '../../types';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refreshToken;
        },
      ]),
      secretOrKey: configService.authConfig.publicKey,
    });
  }

  async validate(payload: {
    userId: Uuid;
    type: TokenType;
    jti?: string;
  }): Promise<UserEntity> {
    if (payload.type !== TokenType.REFRESH_TOKEN) {
      throw new UnauthorizedException('Invalid token type for refresh');
    }

    const user = await this.userService.findOne({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found for refresh token');
    }

    return user;
  }
}
