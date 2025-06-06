import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type ThrottlerOptions } from '@nestjs/throttler';
import { type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isNil } from 'lodash';
import { default as parse, type Units } from 'parse-duration';

import { UserSubscriber } from '../../entity-subscribers/user-subscriber';
import { SnakeNamingStrategy } from '../../snake-naming.strategy';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  private getNumber(key: string, optional = false): number {
    const value = optional ? this.getOptional(key) : this.get(key);

    if (!value && optional) {
      return 0;
    }

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getDuration(key: string, format?: Units): number {
    const value = this.getString(key);
    const duration = parse(value, format);

    if (duration === undefined) {
      throw new Error(`${key} environment variable is not a valid duration`);
    }

    return duration;
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string, optional = false): string {
    const value = optional ? this.getOptional(key) : this.get(key);

    if (!value && optional) {
      return '';
    }

    return value!.replaceAll('\\n', '\n');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get fallbackLanguage(): string {
    return this.getString('FALLBACK_LANGUAGE');
  }

  get throttlerConfigs(): ThrottlerOptions {
    return {
      ttl: this.getDuration('THROTTLER_TTL', 'second'),
      limit: this.getNumber('THROTTLER_LIMIT'),
      // storage: new ThrottlerStorageRedisService(new Redis(this.redis)),
    };
  }

  get postgresConfig(): TypeOrmModuleOptions {
    const entities = [
      __dirname + '/../../modules/**/*.entity{.ts,.js}',
      __dirname + '/../../modules/**/*.view-entity{.ts,.js}',
    ];
    const migrations = [__dirname + '/../../database/migrations/*{.ts,.js}'];

    return {
      entities,
      migrations,
      // keepConnectionAlive: !this.isTest,
      dropSchema: this.isTest,
      type: 'postgres',
      name: 'default',
      host: this.getString('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.getString('DB_USERNAME'),
      password: this.getString('DB_PASSWORD'),
      database: this.getString('DB_DATABASE'),
      subscribers: [UserSubscriber],
      migrationsRun: true,
      logging: this.getBoolean('ENABLE_ORM_LOGS'),
      namingStrategy: new SnakeNamingStrategy(),
    };
  }

  get awsS3Config() {
    return {
      bucketRegion: this.getString('AWS_S3_BUCKET_REGION'),
      bucketApiVersion: this.getString('AWS_S3_API_VERSION'),
      bucketName: this.getString('AWS_S3_BUCKET_NAME'),
    };
  }

  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION');
  }

  get natsEnabled(): boolean {
    return this.getBoolean('NATS_ENABLED');
  }

  get natsConfig() {
    return {
      host: this.getString('NATS_HOST'),
      port: this.getNumber('NATS_PORT'),
    };
  }

  get authConfig() {
    const jwtRefreshExpirationTime =
      this.getNumber('JWT_REFRESH_EXPIRATION_TIME', true) || 604_800; // 7 days

    return {
      privateKey: this.getString('JWT_PRIVATE_KEY'),
      publicKey: this.getString('JWT_PUBLIC_KEY'),
      jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME') || 900, // 15 minutes
      jwtRefreshExpirationTime,
      cookieMaxAge: jwtRefreshExpirationTime * 1000, // 7 days in milliseconds
    };
  }

  get redisConfig() {
    return {
      host: this.getString('REDIS_HOST'),
      port: this.getNumber('REDIS_PORT'),
      password: this.getString('REDIS_PASSWORD', true), // Optional password
      db: this.getNumber('REDIS_DB', true) || 0, // Default to DB 0
    };
  }

  get cacheConfig() {
    return {
      defaultTtl: this.getNumber('CACHE_DEFAULT_TTL', true) || 300, // 5 minutes default
      maxItems: this.getNumber('CACHE_MAX_ITEMS', true) || 1000,
      userPermissionsTtl:
        this.getNumber('CACHE_USER_PERMISSIONS_TTL', true) || 300,
    };
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
    };
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }

  private getOptional(key: string): string | undefined {
    return this.configService.get<string>(key);
  }
}
