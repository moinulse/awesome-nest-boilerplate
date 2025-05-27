/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, type TestingModule } from '@nestjs/testing';

import { QueueService } from '../queue/queue.service';
import { EmailQueueService, type IEmailContext } from './email-queue.service';

describe('EmailQueueService', () => {
  let service: EmailQueueService;

  const mockQueueService = {
    addEmailJob: jest.fn(),
    getQueueStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailQueueService,
        {
          provide: QueueService,
          useValue: mockQueueService,
        },
      ],
    }).compile();

    service = module.get<EmailQueueService>(EmailQueueService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendWelcomeEmail', () => {
    it('should queue welcome email with correct parameters', async () => {
      const email = 'test@example.com';
      const context: IEmailContext = {
        username: 'John Doe',
        loginUrl: 'https://app.com/login',
      };

      mockQueueService.addEmailJob.mockResolvedValue(undefined);

      await service.sendWelcomeEmail(email, context);

      expect(mockQueueService.addEmailJob).toHaveBeenCalledWith(
        'SEND_WELCOME',
        {
          to: email,
          subject: 'Welcome to our platform!',
          template: 'welcome',
          context,
        },
      );
    });

    it('should handle errors and re-throw them', async () => {
      const email = 'test@example.com';
      const context: IEmailContext = { username: 'John Doe' };
      const error = new Error('Queue error');

      mockQueueService.addEmailJob.mockRejectedValue(error);

      await expect(service.sendWelcomeEmail(email, context)).rejects.toThrow(
        'Queue error',
      );
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should queue password reset email with correct parameters', async () => {
      const email = 'test@example.com';
      const context: IEmailContext = {
        username: 'John Doe',
        resetUrl: 'https://app.com/reset?token=abc123',
      };

      mockQueueService.addEmailJob.mockResolvedValue(undefined);

      await service.sendPasswordResetEmail(email, context);

      expect(mockQueueService.addEmailJob).toHaveBeenCalledWith(
        'SEND_RESET_PASSWORD',
        {
          to: email,
          subject: 'Password Reset Request',
          template: 'password-reset',
          context,
        },
      );
    });
  });

  describe('sendVerificationEmail', () => {
    it('should queue verification email with correct parameters', async () => {
      const email = 'test@example.com';
      const context: IEmailContext = {
        username: 'John Doe',
        verificationUrl: 'https://app.com/verify?token=abc123',
      };

      mockQueueService.addEmailJob.mockResolvedValue(undefined);

      await service.sendVerificationEmail(email, context);

      expect(mockQueueService.addEmailJob).toHaveBeenCalledWith(
        'SEND_VERIFICATION',
        {
          to: email,
          subject: 'Verify your email address',
          template: 'email-verification',
          context,
        },
      );
    });
  });

  describe('sendCustomEmail', () => {
    it('should queue custom email with correct parameters', async () => {
      const email = 'test@example.com';
      const subject = 'Custom Subject';
      const template = 'custom-template';
      const context: IEmailContext = {
        username: 'John Doe',
        customData: 'test data',
      };

      mockQueueService.addEmailJob.mockResolvedValue(undefined);

      await service.sendCustomEmail(email, subject, template, context);

      expect(mockQueueService.addEmailJob).toHaveBeenCalledWith(
        'SEND_NOTIFICATION',
        {
          to: email,
          subject,
          template,
          context,
        },
      );
    });

    it('should handle multiple recipients', async () => {
      const emails = ['user1@example.com', 'user2@example.com'];
      const subject = 'Custom Subject';
      const template = 'custom-template';
      const context: IEmailContext = { username: 'John Doe' };

      mockQueueService.addEmailJob.mockResolvedValue(undefined);

      await service.sendCustomEmail(emails, subject, template, context);

      expect(mockQueueService.addEmailJob).toHaveBeenCalledWith(
        'SEND_NOTIFICATION',
        {
          to: emails,
          subject,
          template,
          context,
        },
      );
    });
  });

  describe('getEmailQueueStats', () => {
    it('should return queue statistics', async () => {
      const mockStats = {
        waiting: 5,
        active: 2,
        completed: 100,
        failed: 3,
      };

      mockQueueService.getQueueStats.mockResolvedValue(mockStats);

      const result = await service.getEmailQueueStats();

      expect(result).toEqual(mockStats);
      expect(mockQueueService.getQueueStats).toHaveBeenCalled();
    });
  });
});
