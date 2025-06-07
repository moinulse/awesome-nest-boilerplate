/* eslint-disable @typescript-eslint/no-explicit-any */
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { type Uuid } from '../../types';
import { type RoleEntity } from '../iam/entities/role.entity';
import { type UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { type UserLoginDto } from './dto/user-login.dto';
import { type UserRegisterDto } from './dto/user-register.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let userService: UserService;

  const mockRole: RoleEntity = {
    id: 'role-id-1' as Uuid,
    name: 'user',
    description: 'Standard user role',
    permissions: [],
    users: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    toDto: jest.fn().mockReturnValue({
      id: 'role-id-1',
      name: 'user',
      description: 'Standard user role',
    }),
  };

  const mockUser: UserEntity = {
    id: 'user-id-1' as Uuid,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'hashedPassword',
    phone: '+1234567890',
    avatar: null,
    roles: [mockRole],
    directPermissions: [],
    fullName: 'John Doe',
    settings: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    toDto: jest.fn().mockReturnValue({
      id: 'user-id-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      avatar: null,
      roles: [
        {
          id: 'role-id-1',
          name: 'user',
          description: 'Standard user role',
        },
      ],
      isActive: true,
    }),
  };

  const mockTokenPayload = new TokenPayloadDto({
    accessToken: 'mock-jwt-token',
    expiresIn: 3600,
  });

  const mockAuthService = {
    validateUser: jest.fn(),
    createAccessToken: jest.fn(),
  };

  const mockUserService = {
    createUser: jest.fn(),
    findOne: jest.fn(),
  };

  const mockApiConfigService = {
    authConfig: {
      jwtExpirationTime: 3600,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: ApiConfigService,
          useValue: mockApiConfigService,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mock-jwt-token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /auth/login', () => {
    const loginDto: UserLoginDto = {
      email: 'john.doe@example.com',
      password: 'password123',
    };

    it('should login user successfully with valid credentials', async () => {
      // Arrange
      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.createAccessToken.mockResolvedValue(mockTokenPayload);

      // Act
      const result = await controller.userLogin(loginDto);

      // Assert
      expect(authService.validateUser).toHaveBeenCalledWith(loginDto);
      expect(authService.createAccessToken).toHaveBeenCalledWith({
        userId: mockUser.id,
        roles: mockUser.roles,
      });
      expect(result).toBeInstanceOf(LoginPayloadDto);
      expect(result.user).toBeDefined();
      expect(result.token).toEqual(mockTokenPayload);
    });

    it('should throw UnauthorizedException with invalid credentials', async () => {
      // Arrange
      mockAuthService.validateUser.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      // Act & Assert
      await expect(controller.userLogin(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.validateUser).toHaveBeenCalledWith(loginDto);
      expect(authService.createAccessToken).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException with non-existent user', async () => {
      // Arrange
      mockAuthService.validateUser.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      const nonExistentUserLogin: UserLoginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      // Act & Assert
      await expect(controller.userLogin(nonExistentUserLogin)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.validateUser).toHaveBeenCalledWith(
        nonExistentUserLogin,
      );
    });

    it('should handle empty credentials', async () => {
      // Arrange
      const emptyLogin: UserLoginDto = {
        email: '',
        password: '',
      };

      mockAuthService.validateUser.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      // Act & Assert
      await expect(controller.userLogin(emptyLogin)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('POST /auth/register', () => {
    const registerDto: UserRegisterDto = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      password: 'password123',
    };

    const mockFile = {
      fieldname: 'avatar',
      originalname: 'avatar.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('fake-image-data'),
      size: 1024,
    } as any;

    it('should register user successfully without avatar', async () => {
      // Arrange
      const mockCreatedUser: UserEntity = {
        ...mockUser,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        email: registerDto.email,
        toDto: jest.fn().mockReturnValue({
          id: 'user-id-1',
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          email: registerDto.email,
          avatar: null,
          roles: [
            {
              id: 'role-id-1',
              name: 'user',
              description: 'Standard user role',
            },
          ],
          isActive: true,
        }),
      };

      mockUserService.createUser.mockResolvedValue(mockCreatedUser);

      // Act
      const result = await controller.userRegister(registerDto);

      // Assert
      expect(userService.createUser).toHaveBeenCalledWith(
        registerDto,
        undefined,
      );
      expect(mockCreatedUser.toDto).toHaveBeenCalledWith({ isActive: true });
      expect(result).toBeDefined();
    });

    it('should register user successfully with avatar', async () => {
      // Arrange
      const mockCreatedUser: UserEntity = {
        ...mockUser,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        email: registerDto.email,
        toDto: jest.fn().mockReturnValue({
          id: 'user-id-1',
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          email: registerDto.email,
          avatar: 'avatar.jpg',
          roles: [
            {
              id: 'role-id-1',
              name: 'user',
              description: 'Standard user role',
            },
          ],
          isActive: true,
        }),
      };

      mockUserService.createUser.mockResolvedValue(mockCreatedUser);

      // Act
      const result = await controller.userRegister(registerDto, mockFile);

      // Assert
      expect(userService.createUser).toHaveBeenCalledWith(
        registerDto,
        mockFile,
      );
      expect(mockCreatedUser.toDto).toHaveBeenCalledWith({ isActive: true });
      expect(result).toBeDefined();
    });

    it('should handle duplicate email registration', async () => {
      // Arrange
      mockUserService.createUser.mockRejectedValue(
        new Error('Email already exists'),
      );

      // Act & Assert
      await expect(controller.userRegister(registerDto)).rejects.toThrow(
        'Email already exists',
      );
      expect(userService.createUser).toHaveBeenCalledWith(
        registerDto,
        undefined,
      );
    });

    it('should handle invalid registration data', async () => {
      // Arrange
      const invalidRegisterDto: UserRegisterDto = {
        firstName: '',
        lastName: '',
        email: 'invalid-email',
        password: '123', // Too short
      };

      mockUserService.createUser.mockRejectedValue(
        new Error('Validation failed'),
      );

      // Act & Assert
      await expect(controller.userRegister(invalidRegisterDto)).rejects.toThrow(
        'Validation failed',
      );
    });
  });

  describe('GET /auth/me (v1)', () => {
    it('should return current user info', () => {
      // Act
      const result = controller.getCurrentUser(mockUser);

      // Assert
      expect(mockUser.toDto).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should return user with correct data structure', () => {
      // Arrange
      const expectedUserDto = {
        id: 'user-id-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        avatar: null,
        roles: [
          {
            id: 'role-id-1',
            name: 'user',
            description: 'Standard user role',
          },
        ],
        isActive: true,
      };

      mockUser.toDto = jest.fn().mockReturnValue(expectedUserDto);

      // Act
      const result = controller.getCurrentUser(mockUser);

      // Assert
      expect(result).toEqual(expectedUserDto);
      expect(result.id).toBe(mockUser.id);
      expect(result.email).toBe(mockUser.email);
      expect(result.isActive).toBe(true);
    });

    it('should handle user without roles', () => {
      // Arrange
      const userWithoutRoles: UserEntity = {
        ...mockUser,
        roles: [],
        toDto: jest.fn().mockReturnValue({
          id: 'user-id-1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          avatar: null,
          roles: [],
          isActive: true,
        }),
      };

      // Act
      const result = controller.getCurrentUser(userWithoutRoles);

      // Assert
      expect(result.roles).toEqual([]);
      expect(userWithoutRoles.toDto).toHaveBeenCalled();
    });

    it('should handle user with multiple roles', () => {
      // Arrange
      const adminRole: RoleEntity = {
        id: 'role-id-2' as Uuid,
        name: 'admin',
        description: 'Administrator role',
        permissions: [],
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        toDto: jest.fn().mockReturnValue({
          id: 'role-id-2',
          name: 'admin',
          description: 'Administrator role',
        }),
      };

      const userWithMultipleRoles: UserEntity = {
        ...mockUser,
        roles: [mockRole, adminRole],
        toDto: jest.fn().mockReturnValue({
          id: 'user-id-1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          avatar: null,
          roles: [
            {
              id: 'role-id-1',
              name: 'user',
              description: 'Standard user role',
            },
            {
              id: 'role-id-2',
              name: 'admin',
              description: 'Administrator role',
            },
          ],
          isActive: true,
        }),
      };

      // Act
      const result = controller.getCurrentUser(userWithMultipleRoles);

      // Assert
      expect(result.roles).toHaveLength(2);
      expect(result.roles[0].name).toBe('user');
      expect(result.roles[1].name).toBe('admin');
    });
  });

  describe('Error Handling', () => {
    it('should handle service errors gracefully', async () => {
      // Arrange
      const loginDto: UserLoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockAuthService.validateUser.mockRejectedValue(
        new Error('Database connection error'),
      );

      // Act & Assert
      await expect(controller.userLogin(loginDto)).rejects.toThrow(
        'Database connection error',
      );
    });

    it('should handle token creation errors', async () => {
      // Arrange
      const loginDto: UserLoginDto = {
        email: 'john.doe@example.com',
        password: 'password123',
      };

      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.createAccessToken.mockRejectedValue(
        new Error('Token creation failed'),
      );

      // Act & Assert
      await expect(controller.userLogin(loginDto)).rejects.toThrow(
        'Token creation failed',
      );
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete login flow', async () => {
      // Arrange
      const loginDto: UserLoginDto = {
        email: 'john.doe@example.com',
        password: 'password123',
      };

      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.createAccessToken.mockResolvedValue(mockTokenPayload);

      // Act
      const result = await controller.userLogin(loginDto);

      // Assert
      expect(result).toBeInstanceOf(LoginPayloadDto);
      expect(result.user).toBeDefined();
      expect(result.token.accessToken).toBe('mock-jwt-token');
      expect(result.token.expiresIn).toBe(3600);
    });

    it('should handle complete registration flow', async () => {
      // Arrange
      const registerDto: UserRegisterDto = {
        firstName: 'New',
        lastName: 'User',
        email: 'new.user@example.com',
        password: 'securepassword123',
      };

      const mockNewUser: UserEntity = {
        ...mockUser,
        firstName: 'New',
        lastName: 'User',
        email: 'new.user@example.com',
        fullName: 'New User',
        toDto: jest.fn().mockReturnValue({
          id: 'user-id-1',
          firstName: 'New',
          lastName: 'User',
          email: 'new.user@example.com',
          avatar: null,
          roles: [
            {
              id: 'role-id-1',
              name: 'user',
              description: 'Standard user role',
            },
          ],
          isActive: true,
        }),
      };

      mockUserService.createUser.mockResolvedValue(mockNewUser);

      // Act
      const result = await controller.userRegister(registerDto);

      // Assert
      expect(userService.createUser).toHaveBeenCalledWith(
        registerDto,
        undefined,
      );
      expect(result).toBeDefined();
    });
  });
});
