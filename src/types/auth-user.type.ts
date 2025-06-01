import type { UserEntity } from '../modules/user/user.entity';

export type AuthenticatedUser = UserEntity & {
  computedPermissions: string[];
};
