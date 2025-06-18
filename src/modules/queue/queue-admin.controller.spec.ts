import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NotFoundException, BadRequestException } from '@nestjs/common';

import { QueueAdminController, QueueDetailsDto, QueueSummaryDto, JobDto, QueueJobCountsDto } from './queue-admin.controller'; // Adjust if DTOs are in separate files

// Mock implementation for the BullMQ Queue
const mockQueue = {
  name: 'monitoring-test-queue',
  isPaused: jest.fn(),
  getJobCounts: jest.fn(),
  getJobs: jest.fn(),
  getJob: jest.fn(),
  // Add any other methods that are used by the controller
};

describe('QueueAdminController', () => {
  let controller: QueueAdminController;
  let queue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QueueAdminController],
      providers: [
        {
          provide: getQueueToken('monitoring-test-queue'),
          useValue: mockQueue,
        },
        // If you had more queues, you'd mock them here as well
        // {
        //   provide: getQueueToken('another-queue'),
        //   useValue: { ...mockQueue, name: 'another-queue' },
        // },
      ],
    }).compile();

    controller = module.get<QueueAdminController>(QueueAdminController);
    queue = module.get<Queue>(getQueueToken('monitoring-test-queue'));

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listQueues', () => {
    it('should return an array of queue summaries', async () => {
      const result = await controller.listQueues();
      // In our current setup, QueueAdminController knows only about injected queues
      expect(result).toEqual([{ name: 'monitoring-test-queue' }]);
      // If more queues were injected and mapped, the test would reflect that
    });
  });

  describe('getQueueDetails', () => {
    it('should return queue details for a known queue', async () => {
      const jobCounts = { waiting: 1, active: 2, completed: 3, failed: 4, delayed: 5, paused: 0 };
      mockQueue.isPaused.mockResolvedValue(false);
      mockQueue.getJobCounts.mockResolvedValue(jobCounts);

      const result: QueueDetailsDto = await controller.getQueueDetails('monitoring-test-queue');

      expect(result.name).toEqual('monitoring-test-queue');
      expect(result.isPaused).toBe(false);
      expect(result.jobCounts).toEqual(jobCounts);
      expect(mockQueue.isPaused).toHaveBeenCalledTimes(1);
      expect(mockQueue.getJobCounts).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException for an unknown queue', async () => {
      await expect(controller.getQueueDetails('unknown-queue')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getJobs', () => {
    it('should return a list of jobs for a valid status', async () => {
      const mockJobs = [
        { id: '1', name: 'job1', data: {}, progress: 0, timestamp: Date.now(), opts: {} },
        { id: '2', name: 'job2', data: {}, progress: 0, timestamp: Date.now(), opts: {} },
      ];
      // BullMQ's getJobs returns Job instances, so we mock that part of the structure.
      // The JobDto constructor will handle the mapping.
      mockQueue.getJobs.mockResolvedValue(mockJobs.map(jobData => ({ ...jobData, returnvalue: null, failedReason: null, stacktrace: [] } as unknown as Job)));

      const result: JobDto[] = await controller.getJobs('monitoring-test-queue', 'completed', 0, 10);

      expect(result.length).toBe(2);
      expect(result[0].id).toEqual('1');
      expect(result[0].status).toEqual('completed'); // Status is assigned from query param in controller
      expect(mockQueue.getJobs).toHaveBeenCalledWith(['completed'], 0, 10, true);
    });

    it('should throw BadRequestException for an invalid job status', async () => {
      await expect(controller.getJobs('monitoring-test-queue', 'invalid-status' as any, 0, 10))
        .rejects.toThrow(BadRequestException);
    });
     it('should throw NotFoundException if queue is not found', async () => {
      await expect(controller.getJobs('unknown-queue', 'completed', 0, 10))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('getJobDetails', () => {
    it('should return job details for a specific job', async () => {
      const jobData = {
        id: '123',
        name: 'specific-job',
        data: { key: 'value' },
        progress: 50,
        timestamp: Date.now(),
        opts: {},
        returnvalue: 'some result',
        failedReason: null,
        stacktrace: [],
        getState: jest.fn().mockResolvedValue('completed') // Mock getState for the Job instance
      };
      mockQueue.getJob.mockResolvedValue(jobData as unknown as Job);

      const result: JobDto = await controller.getJobDetails('monitoring-test-queue', '123');

      expect(result.id).toEqual('123');
      expect(result.name).toEqual('specific-job');
      expect(result.data).toEqual({ key: 'value' });
      expect(result.status).toEqual('completed');
      expect(mockQueue.getJob).toHaveBeenCalledWith('123');
      expect(jobData.getState).toHaveBeenCalled();
    });

    it('should throw NotFoundException if job is not found', async () => {
      mockQueue.getJob.mockResolvedValue(null);
      await expect(controller.getJobDetails('monitoring-test-queue', 'unknown-job-id'))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if queue is not found', async () => {
      await expect(controller.getJobDetails('unknown-queue', '123'))
        .rejects.toThrow(NotFoundException);
    });
  });
});
