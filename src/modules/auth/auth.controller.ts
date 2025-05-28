import {
  Body,
  Controller,
  Get,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  Version,
  Res, // Added Res
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express'; // Added Response

import { ApiFile, Auth, AuthUser } from '../../decorators';
import { ApiConfigService } from '../../shared/services/api-config.service'; // Added ApiConfigService
import { type IFile } from '../../interfaces';
import { UserDto } from '../user/dtos/user.dto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private configService: ApiConfigService, // Injected ApiConfigService
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  async userLogin(
    @Body() userLoginDto: UserLoginDto,
    @Res({ passthrough: true }) res: Response, // Added Response object
  ): Promise<LoginPayloadDto> {
    const userEntity = await this.authService.validateUser(userLoginDto);

    const accessTokenPayload = await this.authService.createAccessToken({
      userId: userEntity.id,
      roles: userEntity.roles,
    });

    const refreshTokenPayload = await this.authService.createRefreshToken({
      userId: userEntity.id,
    });

    // Set refresh token in cookie
    res.cookie('refreshToken', refreshTokenPayload.accessToken, {
      httpOnly: true,
      secure: this.configService.nodeEnv === 'production',
      samesite: 'strict',
      path: '/',
      maxAge: refreshTokenPayload.expiresIn * 1000, // Convert seconds to milliseconds
    });

    return new LoginPayloadDto(userEntity.toDto(), accessTokenPayload);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
  @ApiFile({ name: 'avatar' })
  async userRegister(
    @Body() userRegisterDto: UserRegisterDto,
    @UploadedFile() file?: IFile,
  ): Promise<UserDto> {
    const createdUser = await this.userService.createUser(
      userRegisterDto,
      file,
    );

    return createdUser.toDto({
      isActive: true,
    });
  }

  @Version('1')
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth(['read:profile:own'])
  @ApiOkResponse({ type: UserDto, description: 'current user info' })
  getCurrentUser(@AuthUser() user: UserEntity): UserDto {
    return user.toDto();
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @Auth()
  @ApiOkResponse({ description: 'Successfully logged out' })
  async userLogout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    // TODO: Invalidate refresh token in database (e.g., remove the stored hash)

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: this.configService.nodeEnv === 'production',
      samesite: 'strict',
      path: '/',
    });

    return { message: 'Logged out successfully' };
  }
}
