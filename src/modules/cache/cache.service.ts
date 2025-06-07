import { timingSafeEqual } from 'node:crypto';

import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { IO_REDIS_KEY } from './redis.constants';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(
    @Inject(IO_REDIS_KEY)
    private readonly redisClient: Redis,
    private readonly configService: ApiConfigService,
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

  async insert(
    key: string,
    value: string | number,
    ttl?: number,
  ): Promise<void> {
    this.logger.debug(`Inserting key: ${key} with value: ${value}`);

    if (ttl) {
      await this.redisClient.set(key, value, 'EX', ttl);
    } else {
      await this.redisClient.set(key, value);
    }
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

    if (!storedValue) {
      return false;
    }

    const storedValueBuffer = Buffer.from(storedValue);
    const valueToCompareBuffer = Buffer.from(value);

    // Ensure buffers are the same length before comparing to prevent timing leaks
    if (storedValueBuffer.length !== valueToCompareBuffer.length) {
      return false;
    }

    return timingSafeEqual(storedValueBuffer, valueToCompareBuffer);
  }

  getUserPermissionsKey(userId: Uuid): string {
    return `user_permissions:${userId}`;
  }

  getUserKey(userId: Uuid): string {
    return `user:${userId}`;
  }

  getRefreshTokenKey(userId: Uuid, tokenId: string): string {
    return `r_token:${userId}:${tokenId}`;
  }

  // Refresh token storage methods
  async storeRefreshToken(
    userId: Uuid,
    tokenId: string,
    tokenHash: string,
  ): Promise<void> {
    const key = this.getRefreshTokenKey(userId, tokenId);
    const ttl = this.configService.authConfig.jwtRefreshExpirationTime;
    await this.insert(key, tokenHash, ttl);
  }

  async validateRefreshToken(
    userId: Uuid,
    tokenId: string,
    tokenHash: string,
  ): Promise<boolean> {
    const key = this.getRefreshTokenKey(userId, tokenId);
    const storedHash = await this.get(key);

    return storedHash === tokenHash;
  }

  async invalidateRefreshToken(userId: Uuid, tokenId: string): Promise<void> {
    const key = this.getRefreshTokenKey(userId, tokenId);
    await this.delete(key);
  }
}
