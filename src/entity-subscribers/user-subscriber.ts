/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { timingSafeEqual } from 'node:crypto';

import {
  type EntitySubscriberInterface,
  EventSubscriber,
  type InsertEvent,
  type UpdateEvent,
} from 'typeorm';

import { generateHash } from '../common/utils';
import { CacheService } from '../modules/cache/cache.service';
import { UserEntity } from '../modules/user/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  constructor(private readonly cacheService: CacheService) {}

  listenTo(): typeof UserEntity {
    return UserEntity;
  }

  beforeInsert(event: InsertEvent<UserEntity>): void {
    if (event.entity.password) {
      event.entity.password = generateHash(event.entity.password);
    }
  }

  async beforeUpdate(event: UpdateEvent<UserEntity>): Promise<void> {
    const entity = event.entity as UserEntity;

    if (entity.id) {
      const cacheKey = this.cacheService.getUserKey(entity.id);
      await this.cacheService.delete(cacheKey);
    }

    if (entity.password && event.databaseEntity?.password) {
      const currentHash = Buffer.from(event.databaseEntity.password, 'utf8');
      const newHash = Buffer.from(entity.password, 'utf8');

      if (
        currentHash.length !== newHash.length ||
        !timingSafeEqual(currentHash, newHash)
      ) {
        entity.password = generateHash(entity.password);
      }
    } else if (entity.password) {
      entity.password = generateHash(entity.password);
    }
  }

  afterLoad(entity: UserEntity): void {
    const rolePermissions =
      entity.roles?.flatMap(
        (role) => role.permissions?.map((p) => p.name) ?? [],
      ) ?? [];

    const directPermissions =
      entity.directPermissions?.map((p) => p.name) ?? [];

    entity.computedPermissions = [
      ...new Set([...rolePermissions, ...directPermissions]),
    ];
  }
}
