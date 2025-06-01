import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { ApiConfigService } from '../../shared/services/api-config.service';

export interface ICacheKeyOptions {
  ttl?: number;
}

export interface IPatternDeleteResult {
  deletedCount: number;
  errors: Error[];
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ApiConfigService,
  ) {}

  async get<T>(key: string): Promise<T | undefined> {
    try {
      const result = await this.cacheManager.get<T>(key);
      this.logger.debug(`Cache GET: ${key} - ${result ? 'HIT' : 'MISS'}`);

      return result === null ? undefined : result;
    } catch (error) {
      this.logger.error(`Cache get error for key ${key}:`, error);

      return undefined;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const effectiveTtl = ttl ?? this.configService.cacheConfig.defaultTtl;
      await this.cacheManager.set(key, value, effectiveTtl);
      this.logger.debug(`Cache SET: ${key} with TTL ${effectiveTtl}s`);
    } catch (error) {
      this.logger.error(`Cache set error for key ${key}:`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
      this.logger.debug(`Cache DEL: ${key}`);
    } catch (error) {
      this.logger.error(`Cache delete error for key ${key}:`, error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const value = await this.cacheManager.get(key);

      return value !== undefined;
    } catch (error) {
      this.logger.error(`Cache exists check error for key ${key}:`, error);

      return false;
    }
  }

  async mget<T>(keys: string[]): Promise<Array<T | undefined>> {
    const results = await Promise.allSettled(
      keys.map((key) => this.get<T>(key)),
    );

    return results.map((result) =>
      result.status === 'fulfilled' ? result.value : undefined,
    );
  }

  async mset<T>(
    keyValuePairs: Array<{ key: string; value: T; ttl?: number }>,
  ): Promise<void> {
    await Promise.allSettled(
      keyValuePairs.map(({ key, value, ttl }) => this.set(key, value, ttl)),
    );
  }

  async clear(): Promise<void> {
    try {
      await this.cacheManager.clear();
      this.logger.debug('Cache cleared');
    } catch (error) {
      this.logger.error('Cache clear error:', error);
    }
  }

  getUserPermissionsKey(userId: Uuid): string {
    return `user_permissions:${userId}`;
  }

  getUserKey(userId: Uuid): string {
    return `user:${userId}`;
  }
}
