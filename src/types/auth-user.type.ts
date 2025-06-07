import { type Permission } from '../constants/permissions.enum';
import type { UserEntity } from '../modules/user/user.entity';

export type AuthenticatedUser = UserEntity & {
  computedPermissions: Array<Permission | string>;
};
