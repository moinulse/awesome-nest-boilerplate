import { createKeyv } from '@keyv/redis';
import { CacheModule as CacheManagerModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [
    CacheManagerModule.registerAsync({
      isGlobal: true,
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService) => {
        // Build Redis URL from config
        const { host, port, password, db } = configService.redisConfig;
        const authPart = password ? `:${password}@` : '';
        const redisUrl = `redis://${authPart}${host}:${port}/${db}`;

        // Create Keyv instance with Redis backend
        return createKeyv(redisUrl, {
          namespace: 'app',
          useUnlink: true, // Use UNLINK for better performance
          clearBatchSize: 1000,
        });
      },
    }),
  ],
  providers: [CacheService],
  exports: [CacheManagerModule, CacheService],
})
export class CacheModule {}
