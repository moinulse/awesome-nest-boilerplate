import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

import { EMAIL_QUEUE, QUEUE_JOBS } from './constants/queue.constants';

export interface IEmailJobData {
  to: string | string[];
  subject: string;
  template?: string;
  context?: Record<string, unknown>;
  html?: string;
  text?: string;
}

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(@InjectQueue(EMAIL_QUEUE) private emailQueue: Queue) {}

  async addEmailJob(
    jobType: keyof typeof QUEUE_JOBS.EMAIL,
    data: IEmailJobData,
    options?: {
      delay?: number;
      attempts?: number;
      priority?: number;
    },
  ): Promise<void> {
    try {
      const jobName = QUEUE_JOBS.EMAIL[jobType];

      await this.emailQueue.add(jobName, data, {
        delay: options?.delay,
        attempts: options?.attempts || 3,
        priority: options?.priority,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: 10,
        removeOnFail: 5,
      });

      this.logger.log(`Email job ${jobName} added to queue`);
    } catch (error) {
      this.logger.error(`Failed to add email job: ${error}`);

      throw error;
    }
  }

  async getQueueStats(): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  }> {
    const waiting = await this.emailQueue.getWaiting();
    const active = await this.emailQueue.getActive();
    const completed = await this.emailQueue.getCompleted();
    const failed = await this.emailQueue.getFailed();

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
    };
  }
}
