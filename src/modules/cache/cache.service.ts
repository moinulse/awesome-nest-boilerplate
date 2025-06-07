import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

import { IO_REDIS_KEY } from './redis.constants';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(
    @Inject(IO_REDIS_KEY)
    private readonly redisClient: Redis,
  ) {}

  async getKeys(pattern?: string): Promise<string[]> {
    this.logger.debug(`Getting keys with pattern: ${pattern ?? '*'}`);

    return this.redisClient.keys(pattern ?? '*');
  }

  async insert(key: string, value: string | number): Promise<void> {
    this.logger.debug(`Inserting key: ${key} with value: ${value}`);

    await this.redisClient.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    this.logger.debug(`Getting key: ${key}`);

    return this.redisClient.get(key);
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async validate(key: string, value: string): Promise<boolean> {
    const storedValue = await this.redisClient.get(key);

    return storedValue === value;
  }

  getUserPermissionsKey(userId: Uuid): string {
    return `user_permissions:${userId}`;
  }

  getUserKey(userId: Uuid): string {
    return `user:${userId}`;
  }
}
