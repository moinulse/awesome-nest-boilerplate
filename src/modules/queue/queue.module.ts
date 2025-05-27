import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { SharedModule } from '../../shared/shared.module';
import { EMAIL_QUEUE } from './constants/queue.constants';
import { QueueService } from './queue.service';

@Module({
  imports: [
    SharedModule,
    BullModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) => ({
        connection: configService.bullmqConfig.connection,
      }),
      inject: [ApiConfigService],
    }),
    BullModule.registerQueue({
      name: EMAIL_QUEUE,
    }),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
