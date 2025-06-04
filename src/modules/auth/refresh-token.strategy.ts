import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenType } from '../../constants';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { type Uuid } from '../../types';
import { UserService } from '../user/user.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ApiConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          if (request.cookies && 'refreshToken' in request.cookies) {
            return request.cookies.refreshToken;
          }

          return null;
        },
        ExtractJwt.fromBodyField('refreshToken'),
      ]),
      secretOrKey: configService.authConfig.publicKey,
      passReqToCallback: true,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static extractJWTFromCookie(request: any): string | null {
    if (request.cookies && 'refreshToken' in request.cookies) {
      return request.cookies.refreshToken;
    }

    return null;
  }

  async validate(
    request: Request,
    payload: {
      userId: Uuid;
      type: TokenType;
    },
  ): Promise<{ userId: Uuid; refreshToken: string }> {
    if (payload.type !== TokenType.REFRESH_TOKEN) {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.userService.findOne({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const refreshToken =
      RefreshTokenStrategy.extractJWTFromCookie(request) ||
      request.body?.refreshToken;

    return {
      userId: payload.userId,
      refreshToken,
    };
  }
}
