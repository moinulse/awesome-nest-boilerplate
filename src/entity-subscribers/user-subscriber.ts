import { timingSafeEqual } from 'node:crypto';

import {
  type EntitySubscriberInterface,
  EventSubscriber,
  type InsertEvent,
  type UpdateEvent,
} from 'typeorm';

import { generateHash } from '../common/utils';
import { UserEntity } from '../modules/user/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  listenTo(): typeof UserEntity {
    return UserEntity;
  }

  beforeInsert(event: InsertEvent<UserEntity>): void {
    if (event.entity.password) {
      event.entity.password = generateHash(event.entity.password);
    }
  }

  beforeUpdate(event: UpdateEvent<UserEntity>): void {
    const entity = event.entity as UserEntity;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
}
