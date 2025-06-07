import { Global, Module, OnApplicationShutdown } from '@nestjs/common';
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
      useFactory: async (configService: ApiConfigService) =>
        new Redis({
          host: configService.redisConfig.host,
          port: configService.redisConfig.port,
          password: configService.redisConfig.password,
          db: configService.redisConfig.db,
        }),
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
      const redis = this.moduleRef.get(IO_REDIS_KEY);
      redis.quit();
      redis.on('end', () => {
        resolve();
      });
    });
  }
}
