import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { IO_REDIS_KEY } from '../cache/redis.constants'; // Adjusted path
import { QueueAdminController } from './queue-admin.controller';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ApiConfigService, IO_REDIS_KEY],
      useFactory: async (
        configService: ApiConfigService,
        redisClient: any, // Type properly if possible, else 'any'
      ) => {
        // BullMQ can reuse the ioredis client directly if configured correctly.
        // Option 1: Create a new connection based on config (standard way)
        // return {
        //   connection: {
        //     host: configService.redisConfig.host,
        //     port: configService.redisConfig.port,
        //     password: configService.redisConfig.password,
        //     db: configService.redisConfig.db,
        //   },
        // };

        // Option 2: Attempt to reuse the existing ioredis client
        // This requires BullMQ to be compatible with the existing client's version and configuration.
        // The `createClient` option in BullMQ is designed for this.
        return {
          // The `createClient` option allows reusing or customizing client creation.
          // 'client' is the ioredis instance from IO_REDIS_KEY
          createClient: (type: 'client' | 'subscriber' | 'bclient', redisOpts?: any) => {
            switch (type) {
              case 'client':
                return redisClient; // Reuse the main client for regular operations
              case 'subscriber':
                // Subscribers should typically be new connections for blocking operations
                return new redisClient.constructor({ // Create a new client of the same type
                  ...redisClient.options,
                  ...redisOpts,
                  maxRetriesPerRequest: null, // Important for subscribers
                });
              case 'bclient':
                // Bclients (blocking clients) also usually need new connections
                return new redisClient.constructor({ // Create a new client of the same type
                  ...redisClient.options,
                  ...redisOpts,
                  maxRetriesPerRequest: null,
                });
              default:
                throw new Error(`Unknown Redis client type: ${type}`);
            }
          },
        };
      },
    }),
    BullModule.registerQueue({
      name: 'monitoring-test-queue', // A sample queue
    }),
  ],
  controllers: [QueueAdminController],
  providers: [QueueService],
  exports: [QueueService, BullModule], // Export BullModule if queues will be injected elsewhere
})
export class QueueModule {}
