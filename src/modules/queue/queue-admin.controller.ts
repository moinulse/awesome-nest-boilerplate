import { Controller, Get, Injectable, Param, Query, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, Job } from 'bullmq';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiProperty } from '@nestjs/swagger';

import { Auth } from '../../decorators/auth.decorator'; // Corrected path
import { Roles } from '../../decorators/roles.decorator'; // Corrected path
import { RoleType } from '../../constants/role-type';   // Corrected path

// --- DTOs for API Responses (can be moved to separate files later) ---

class JobDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  data?: any;

  @ApiProperty()
  progress: number | object;

  @ApiProperty()
  timestamp: number;

  @ApiProperty({ required: false })
  processedOn?: number;

  @ApiProperty({ required: false })
  finishedOn?: number;

  @ApiProperty({ required: false })
  returnValue?: any;

  @ApiProperty({ required: false })
  failedReason?: string;

  @ApiProperty()
  stacktrace: string[];

  @ApiProperty()
  opts: object;

  @ApiProperty()
  status: string; // e.g., 'completed', 'waiting', 'active', 'failed', 'delayed'

  constructor(job: Job) {
    this.id = String(job.id); // Ensure ID is string
    this.name = job.name;
    this.data = job.data;
    this.progress = job.progress;
    this.timestamp = job.timestamp;
    this.processedOn = job.processedOn;
    this.finishedOn = job.finishedOn;
    this.returnValue = job.returnvalue; // Note: BullMQ uses 'returnvalue'
    this.failedReason = job.failedReason;
    this.stacktrace = job.stacktrace;
    this.opts = job.opts;
  }
}

class QueueJobCountsDto {
  @ApiProperty() waiting: number;
  @ApiProperty() active: number;
  @ApiProperty() completed: number;
  @ApiProperty() failed: number;
  @ApiProperty() delayed: number;
  @ApiProperty() paused: number; // BullMQ v4+ includes paused in getJobCounts
}

class QueueDetailsDto {
  @ApiProperty() name: string;
  @ApiProperty() isPaused: boolean;
  @ApiProperty({ type: QueueJobCountsDto }) jobCounts: QueueJobCountsDto;
}

class QueueSummaryDto {
  @ApiProperty() name: string;
  // Add more summary fields if needed, e.g. from getJobCounts()
}

// --- Controller Implementation ---

// Placeholder for auth decorators
// import { Auth } from '../../decorators/auth.decorator';
// import { Roles } from '../../decorators/roles.decorator';
// import { RoleType } from '../../constants/role-type';
// Ensure ApiProperty is imported for DTOs (already present in the line above this diff)


@ApiTags('Admin - Queue Management')
@Controller('admin/queues')
@Auth() // Apply auth to the entire controller
@Roles(RoleType.ADMIN) // Restrict to admin users
@Injectable()
export class QueueAdminController {
  private readonly queues: Map<string, Queue> = new Map();

  constructor(
    // Inject all queues you want to manage here.
    // For now, only 'monitoring-test-queue' is explicitly registered and injected.
    @InjectQueue('monitoring-test-queue') private readonly monitoringTestQueue: Queue,
  ) {
    this.queues.set(this.monitoringTestQueue.name, this.monitoringTestQueue);
  }

  private async getQueue(name: string): Promise<Queue> {
    const queue = this.queues.get(name);
    if (!queue) {
      throw new NotFoundException(`Queue with name '${name}' not found.`);
    }
    return queue;
  }

  @Get()
  @ApiOperation({ summary: 'List all manageable queues' })
  @ApiResponse({ status: 200, description: 'A list of queue summaries.', type: [QueueSummaryDto] })
  async listQueues(): Promise<QueueSummaryDto[]> {
    return Array.from(this.queues.keys()).map(name => ({ name }));
  }

  @Get(':queueName')
  @ApiOperation({ summary: 'Get detailed information for a specific queue' })
  @ApiParam({ name: 'queueName', description: 'The name of the queue' })
  @ApiResponse({ status: 200, description: 'Detailed information about the queue.', type: QueueDetailsDto })
  async getQueueDetails(@Param('queueName') queueName: string): Promise<QueueDetailsDto> {
    const queue = await this.getQueue(queueName);
    const jobCounts = await queue.getJobCounts() as QueueJobCountsDto; // Cast to DTO type
    return {
      name: queue.name,
      isPaused: await queue.isPaused(),
      jobCounts,
    };
  }

  @Get(':queueName/jobs')
  @ApiOperation({ summary: 'Get jobs from a specific queue' })
  @ApiParam({ name: 'queueName', description: 'The name of the queue' })
  @ApiQuery({ name: 'status', required: true, description: 'Job status type to fetch', enum: ['waiting', 'active', 'completed', 'failed', 'delayed', 'paused'] })
  @ApiQuery({ name: 'start', required: false, description: 'Start index for pagination (0-based)', type: Number, example: 0 })
  @ApiQuery({ name: 'end', required: false, description: 'End index for pagination (inclusive)', type: Number, example: 99 })
  @ApiResponse({ status: 200, description: 'A list of jobs from the queue.', type: [JobDto] })
  async getJobs(
    @Param('queueName') queueName: string,
    @Query('status') status: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed' | 'paused',
    @Query('start') start: number = 0,
    @Query('end') end: number = 99,
  ): Promise<JobDto[]> {
    const queue = await this.getQueue(queueName);
    const validJobStatuses = ['waiting', 'active', 'completed', 'failed', 'delayed', 'paused'];

    if (!validJobStatuses.includes(status)) {
      throw new BadRequestException(`Invalid job status: ${status}. Must be one of ${validJobStatuses.join(', ')}`);
    }

    // Ensure start and end are numbers
    const numericStart = Number(start);
    const numericEnd = Number(end);

    if (isNaN(numericStart) || isNaN(numericEnd)) {
        throw new BadRequestException('Start and end parameters must be numbers.');
    }

    const jobs = await queue.getJobs([status], numericStart, numericEnd, true); // true for ascending order

    // Map to JobDto and manually set status because job.getState() is async and expensive in a loop
    const jobDtos = jobs.map(job => {
        const jobDto = new JobDto(job);
        jobDto.status = status; // Assign the queried status directly
        return jobDto;
    });
    return jobDtos;
  }

  @Get(':queueName/jobs/:jobId')
  @ApiOperation({ summary: 'Get details for a specific job in a queue' })
  @ApiParam({ name: 'queueName', description: 'The name of the queue' })
  @ApiParam({ name: 'jobId', description: 'The ID of the job' })
  @ApiResponse({ status: 200, description: 'Detailed information about the job.', type: JobDto })
  async getJobDetails(
    @Param('queueName') queueName: string,
    @Param('jobId') jobId: string,
  ): Promise<JobDto> {
    const queue = await this.getQueue(queueName);
    const job = await queue.getJob(jobId);

    if (!job) {
      throw new NotFoundException(`Job with ID '${jobId}' not found in queue '${queueName}'.`);
    }
    const jobDto = new JobDto(job);
    jobDto.status = await job.getState(); // Get current state for a single job
    return jobDto;
  }
}
