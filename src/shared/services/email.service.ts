import { Injectable, Logger } from '@nestjs/common';
import { render } from '@react-email/render';
import * as nodemailer from 'nodemailer';
import { type Transporter } from 'nodemailer';
import * as React from 'react';

import { ApiConfigService } from './api-config.service';

export interface IEmailOptions {
  to: string | string[];
  subject: string;
  template?: string;
  context?: Record<string, unknown>;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private transporter!: Transporter;

  constructor(private readonly configService: ApiConfigService) {
    this.createTransporter();
  }

  private createTransporter(): void {
    const emailConfig = this.configService.emailConfig;

    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: emailConfig.auth.user
        ? {
            user: emailConfig.auth.user,
            pass: emailConfig.auth.pass,
          }
        : undefined,
    });

    // Verify connection configuration
    this.transporter.verify((error) => {
      if (error) {
        this.logger.error('Failed to connect to email server:', error);
      } else {
        this.logger.log('Email server connection established');
      }
    });
  }

  async sendEmail(options: IEmailOptions): Promise<void> {
    try {
      const emailConfig = this.configService.emailConfig;

      const mailOptions = {
        from: emailConfig.from,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      };

      const result = await this.transporter.sendMail(mailOptions);

      this.logger.log(`Email sent successfully: ${result.messageId}`);
    } catch (error) {
      this.logger.error('Failed to send email:', error);

      throw error;
    }
  }

  async sendTemplateEmail(
    to: string | string[],
    subject: string,
    template: React.ReactElement,
    context?: Record<string, unknown>,
  ): Promise<void> {
    try {
      // Render React Email template to HTML
      const html = await render(template, { pretty: true });
      const text = await render(template, { plainText: true });

      await this.sendEmail({
        to,
        subject,
        html,
        text,
        context,
      });
    } catch (error) {
      this.logger.error('Failed to send template email:', error);

      throw error;
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();

      return true;
    } catch (error) {
      this.logger.error('Email connection verification failed:', error);

      return false;
    }
  }
}
