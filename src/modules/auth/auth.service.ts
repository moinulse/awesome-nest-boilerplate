import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { validateHash } from '../../common/utils';
import { type RoleType, TokenType } from '../../constants';
import { UserNotFoundException } from '../../exceptions';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { type UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { type UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private userService: UserService,
  ) {}

  async createAccessToken(data: {
    role: RoleType;
    userId: Uuid;
  }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync({
        userId: data.userId,
        type: TokenType.ACCESS_TOKEN,
        role: data.role,
      }),
    });
  }

  async createRefreshToken(data: {
    role: RoleType;
    userId: Uuid;
  }): Promise<string> {
    return this.jwtService.signAsync({
      userId: data.userId,
      type: TokenType.REFRESH_TOKEN,
      role: data.role,
    });
  }

  async validateRefreshToken(token: string): Promise<UserEntity> {
    const payload = this.jwtService.verify(token, {
      secret: this.configService.authConfig.publicKey,
    });

    if (payload.type !== TokenType.REFRESH_TOKEN) {
      throw new UserNotFoundException();
    }

    const user = await this.userService.findOne({
      id: payload.userId,
      role: payload.role,
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
    const user = await this.userService.findOne({
      email: userLoginDto.email,
    });

    const isPasswordValid = await validateHash(
      userLoginDto.password,
      user?.password,
    );

    if (!isPasswordValid) {
      throw new UserNotFoundException();
    }

    return user!;
  }
}
