import {
  Permission,
  PERMISSION_DESCRIPTIONS,
} from '../../constants/permissions.enum';

export const permissionSeeds = Object.values(Permission).map((permission) => ({
  name: permission,
  description: PERMISSION_DESCRIPTIONS[permission],
  isSystem: true,
}));

export const PERMISSIONS_SEED_DATA = [
  {
    name: Permission.USER_READ,
    description: PERMISSION_DESCRIPTIONS[Permission.USER_READ],
    isSystem: true,
  },
  {
    name: Permission.USER_CREATE,
    description: PERMISSION_DESCRIPTIONS[Permission.USER_CREATE],
    isSystem: true,
  },
  {
    name: Permission.USER_UPDATE,
    description: PERMISSION_DESCRIPTIONS[Permission.USER_UPDATE],
    isSystem: true,
  },
  {
    name: Permission.USER_DELETE,
    description: PERMISSION_DESCRIPTIONS[Permission.USER_DELETE],
    isSystem: true,
  },
  {
    name: Permission.USER_LIST,
    description: PERMISSION_DESCRIPTIONS[Permission.USER_LIST],
    isSystem: true,
  },
  {
    name: Permission.ROLE_READ,
    description: PERMISSION_DESCRIPTIONS[Permission.ROLE_READ],
    isSystem: true,
  },
  {
    name: Permission.ROLE_MANAGE,
    description: PERMISSION_DESCRIPTIONS[Permission.ROLE_MANAGE],
    isSystem: true,
  },
  {
    name: Permission.ROLE_LIST,
    description: PERMISSION_DESCRIPTIONS[Permission.ROLE_LIST],
    isSystem: true,
  },
  {
    name: Permission.ROLE_ASSIGN,
    description: PERMISSION_DESCRIPTIONS[Permission.ROLE_ASSIGN],
    isSystem: true,
  },
  {
    name: Permission.PERMISSION_READ,
    description: PERMISSION_DESCRIPTIONS[Permission.PERMISSION_READ],
    isSystem: true,
  },
  {
    name: Permission.PERMISSION_MANAGE,
    description: PERMISSION_DESCRIPTIONS[Permission.PERMISSION_MANAGE],
    isSystem: true,
  },
  {
    name: Permission.PERMISSION_LIST,
    description: PERMISSION_DESCRIPTIONS[Permission.PERMISSION_LIST],
    isSystem: true,
  },
  {
    name: Permission.PERMISSION_ASSIGN,
    description: PERMISSION_DESCRIPTIONS[Permission.PERMISSION_ASSIGN],
    isSystem: true,
  },
  {
    name: Permission.SYSTEM_ADMIN,
    description: PERMISSION_DESCRIPTIONS[Permission.SYSTEM_ADMIN],
    isSystem: true,
  },
  {
    name: Permission.SYSTEM_SETTINGS,
    description: PERMISSION_DESCRIPTIONS[Permission.SYSTEM_SETTINGS],
    isSystem: true,
  },
  {
    name: Permission.SYSTEM_LOGS,
    description: PERMISSION_DESCRIPTIONS[Permission.SYSTEM_LOGS],
    isSystem: true,
  },
  {
    name: Permission.SYSTEM_MAINTENANCE,
    description: PERMISSION_DESCRIPTIONS[Permission.SYSTEM_MAINTENANCE],
    isSystem: true,
  },
  {
    name: Permission.AUDIT_READ,
    description: PERMISSION_DESCRIPTIONS[Permission.AUDIT_READ],
    isSystem: true,
  },
  {
    name: Permission.AUDIT_EXPORT,
    description: PERMISSION_DESCRIPTIONS[Permission.AUDIT_EXPORT],
    isSystem: true,
  },
  {
    name: Permission.HEALTH_READ,
    description: PERMISSION_DESCRIPTIONS[Permission.HEALTH_READ],
    isSystem: true,
  },
  {
    name: Permission.AUTH_REFRESH,
    description: PERMISSION_DESCRIPTIONS[Permission.AUTH_REFRESH],
    isSystem: true,
  },
  {
    name: Permission.AUTH_LOGOUT,
    description: PERMISSION_DESCRIPTIONS[Permission.AUTH_LOGOUT],
    isSystem: true,
  },
  {
    name: Permission.PROFILE_READ,
    description: PERMISSION_DESCRIPTIONS[Permission.PROFILE_READ],
    isSystem: true,
  },
  {
    name: Permission.PROFILE_UPDATE,
    description: PERMISSION_DESCRIPTIONS[Permission.PROFILE_UPDATE],
    isSystem: true,
  },
] as const;
