import { Module } from '@nestjs/common';

import { SharedModule } from '../../shared/shared.module';
import { QueueModule } from '../queue/queue.module';
import { EmailQueueService } from './email-queue.service';
import { EmailProcessor } from './processors/email.processor';

@Module({
  imports: [SharedModule, QueueModule],
  providers: [EmailQueueService, EmailProcessor],
  exports: [EmailQueueService],
})
export class EmailModule {}
