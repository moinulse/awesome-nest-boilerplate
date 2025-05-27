import { Injectable, Logger } from '@nestjs/common';

import { QueueService } from '../queue/queue.service';

export interface IEmailContext {
  username?: string;
  loginUrl?: string;
  resetUrl?: string;
  verificationUrl?: string;
  expiresIn?: string;
  [key: string]: unknown;
}

@Injectable()
export class EmailQueueService {
  private readonly logger = new Logger(EmailQueueService.name);

  constructor(private readonly queueService: QueueService) {}

  async sendWelcomeEmail(to: string, context: IEmailContext): Promise<void> {
    try {
      await this.queueService.addEmailJob('SEND_WELCOME', {
        to,
        subject: 'Welcome to our platform!',
        template: 'welcome',
        context,
      });

      this.logger.log(`Welcome email queued for ${to}`);
    } catch (error) {
      this.logger.error(`Failed to queue welcome email for ${to}:`, error);

      throw error;
    }
  }

  async sendPasswordResetEmail(
    to: string,
    context: IEmailContext,
  ): Promise<void> {
    try {
      await this.queueService.addEmailJob('SEND_RESET_PASSWORD', {
        to,
        subject: 'Password Reset Request',
        template: 'password-reset',
        context,
      });

      this.logger.log(`Password reset email queued for ${to}`);
    } catch (error) {
      this.logger.error(
        `Failed to queue password reset email for ${to}:`,
        error,
      );

      throw error;
    }
  }

  async sendVerificationEmail(
    to: string,
    context: IEmailContext,
  ): Promise<void> {
    try {
      await this.queueService.addEmailJob('SEND_VERIFICATION', {
        to,
        subject: 'Verify your email address',
        template: 'email-verification',
        context,
      });

      this.logger.log(`Verification email queued for ${to}`);
    } catch (error) {
      this.logger.error(`Failed to queue verification email for ${to}:`, error);

      throw error;
    }
  }

  async sendCustomEmail(
    to: string | string[],
    subject: string,
    template: string,
    context: IEmailContext,
  ): Promise<void> {
    try {
      await this.queueService.addEmailJob('SEND_NOTIFICATION', {
        to,
        subject,
        template,
        context,
      });

      const recipient = Array.isArray(to) ? to.join(', ') : to;
      this.logger.log(`Custom email "${subject}" queued for ${recipient}`);
    } catch (error) {
      this.logger.error(`Failed to queue custom email:`, error);

      throw error;
    }
  }

  async getEmailQueueStats() {
    return this.queueService.getQueueStats();
  }
}
