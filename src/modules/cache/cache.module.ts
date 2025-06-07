import { Global, Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Redis } from 'ioredis';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { CacheService } from './cache.service';
import { IO_REDIS_KEY } from './redis.constants';

@Global()
@Module({
  providers: [
    {
      provide: IO_REDIS_KEY,
      useFactory: async (configService: ApiConfigService) => {
        const logger = new Logger('RedisProvider');
        const redis = new Redis({
          host: configService.redisConfig.host,
          port: configService.redisConfig.port,
          password: configService.redisConfig.password,
          db: configService.redisConfig.db,
          lazyConnect: true, // Don't connect immediately
        });

        redis.on('error', (error) => {
          logger.error('Redis connection error:', error);
        });

        redis.connect().catch((error) => {
          logger.error(
            `Failed to connect to Redis during startup: ${error.message}`,
          );
        });

        return redis;
      },
      inject: [ApiConfigService],
    },
    CacheService,
  ],
  exports: [CacheService],
})
export class CacheModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  async onApplicationShutdown(_signal?: string): Promise<void> {
    return new Promise<void>((resolve) => {
      const redis = this.moduleRef.get<Redis>(IO_REDIS_KEY, { strict: false });

      Promise.race([
        redis.quit(),
        new Promise((r) => setTimeout(r, 1_000)),
      ]).finally(() => resolve());
    });
  }
}
