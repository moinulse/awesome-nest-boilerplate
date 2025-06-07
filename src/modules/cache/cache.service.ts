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
    this.logger.debug(`Scanning for keys with pattern: ${pattern ?? '*'}`);
    const stream = this.redisClient.scanStream({
      match: pattern ?? '*',
      count: 100,
    });
    const keys: string[] = [];

    return new Promise((resolve, reject) => {
      stream.on('data', (resultKeys: string[]) => {
        keys.push(...resultKeys);
      });
      stream.on('error', (err) => {
        this.logger.error(`Error scanning keys: ${err}`);
        reject(err);
      });
      stream.on('end', () => {
        this.logger.debug(
          `Found ${keys.length} keys matching pattern: ${pattern ?? '*'}`,
        );
        resolve(keys);
      });
    });
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
