/* eslint-disable @typescript-eslint/naming-convention */
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { EmailService } from '../../../shared/services/email.service';
import { EMAIL_QUEUE, QUEUE_JOBS } from '../../queue/constants/queue.constants';
import { type IEmailJobData } from '../../queue/queue.service';

@Processor(EMAIL_QUEUE)
@Injectable()
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job<IEmailJobData>): Promise<void> {
    this.logger.log(`Processing email job: ${job.name} with ID: ${job.id}`);

    try {
      switch (job.name) {
        case QUEUE_JOBS.EMAIL.SEND_WELCOME:
          await this.handleWelcomeEmail(job.data);
          break;

        case QUEUE_JOBS.EMAIL.SEND_RESET_PASSWORD:
          await this.handlePasswordResetEmail(job.data);
          break;

        case QUEUE_JOBS.EMAIL.SEND_VERIFICATION:
          await this.handleVerificationEmail(job.data);
          break;

        case QUEUE_JOBS.EMAIL.SEND_NOTIFICATION:
          await this.handleNotificationEmail(job.data);
          break;

        default:
          this.logger.warn(`Unknown email job type: ${job.name}`);
      }

      this.logger.log(`Email job ${job.name} completed successfully`);
    } catch (error) {
      this.logger.error(`Email job ${job.name} failed:`, error);

      throw error;
    }
  }

  private async handleWelcomeEmail(data: IEmailJobData): Promise<void> {
    // Import template dynamically to avoid loading React at startup
    const { WelcomeEmail } = await import('../templates/welcome-email');

    await this.emailService.sendTemplateEmail(
      data.to,
      data.subject,
      WelcomeEmail(data.context || {}),
      data.context,
    );
  }

  private async handlePasswordResetEmail(data: IEmailJobData): Promise<void> {
    const { PasswordResetEmail } = await import(
      '../templates/password-reset-email'
    );

    await this.emailService.sendTemplateEmail(
      data.to,
      data.subject,
      PasswordResetEmail(data.context || {}),
      data.context,
    );
  }

  private async handleVerificationEmail(data: IEmailJobData): Promise<void> {
    const { VerificationEmail } = await import(
      '../templates/verification-email'
    );

    await this.emailService.sendTemplateEmail(
      data.to,
      data.subject,
      VerificationEmail(data.context || {}),
      data.context,
    );
  }

  private async handleNotificationEmail(data: IEmailJobData): Promise<void> {
    if (data.html || data.text) {
      await this.emailService.sendEmail({
        to: data.to,
        subject: data.subject,
        html: data.html,
        text: data.text,
      });
    } else {
      this.logger.warn('Notification email job missing content');
    }
  }
}
