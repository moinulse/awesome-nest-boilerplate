export enum Permission {
  // User management permissions
  USER_READ = 'user:read',
  USER_CREATE = 'user:create',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  USER_LIST = 'user:list',

  // Role management permissions
  ROLE_READ = 'role:read',
  ROLE_MANAGE = 'role:manage',
  ROLE_LIST = 'role:list',
  ROLE_ASSIGN = 'role:assign',

  // Permission management permissions
  PERMISSION_READ = 'permission:read',
  PERMISSION_MANAGE = 'permission:manage',
  PERMISSION_LIST = 'permission:list',
  PERMISSION_ASSIGN = 'permission:assign',

  // System administration permissions
  SYSTEM_ADMIN = 'system:admin',
  SYSTEM_SETTINGS = 'system:settings',
  SYSTEM_LOGS = 'system:logs',
  SYSTEM_MAINTENANCE = 'system:maintenance',

  // Audit permissions
  AUDIT_READ = 'audit:read',
  AUDIT_EXPORT = 'audit:export',

  // Health check permissions
  HEALTH_READ = 'health:read',

  // Authentication permissions
  AUTH_REFRESH = 'auth:refresh',
  AUTH_LOGOUT = 'auth:logout',

  // Profile permissions
  PROFILE_READ = 'profile:read',
  PROFILE_UPDATE = 'profile:update',
}

export const PERMISSION_DESCRIPTIONS: Record<Permission, string> = {
  [Permission.USER_READ]: 'View user details',
  [Permission.USER_CREATE]: 'Create new users',
  [Permission.USER_UPDATE]: 'Update existing users',
  [Permission.USER_DELETE]: 'Delete users',
  [Permission.USER_LIST]: 'List all users',

  [Permission.ROLE_READ]: 'View role details',
  [Permission.ROLE_MANAGE]: 'Manage roles',
  [Permission.ROLE_LIST]: 'List all roles',
  [Permission.ROLE_ASSIGN]: 'Assign roles to users',

  [Permission.PERMISSION_READ]: 'View permission details',
  [Permission.PERMISSION_MANAGE]: 'Manage permissions',
  [Permission.PERMISSION_LIST]: 'List all permissions',
  [Permission.PERMISSION_ASSIGN]: 'Assign permissions to roles or users',

  [Permission.SYSTEM_ADMIN]: 'Full system administration access',
  [Permission.SYSTEM_SETTINGS]: 'Manage system settings',
  [Permission.SYSTEM_LOGS]: 'View system logs',
  [Permission.SYSTEM_MAINTENANCE]: 'Perform system maintenance tasks',

  [Permission.AUDIT_READ]: 'View audit logs',
  [Permission.AUDIT_EXPORT]: 'Export audit data',

  [Permission.HEALTH_READ]: 'View system health status',

  [Permission.AUTH_REFRESH]: 'Refresh authentication tokens',
  [Permission.AUTH_LOGOUT]: 'Log out from system',

  [Permission.PROFILE_READ]: 'View own profile',
  [Permission.PROFILE_UPDATE]: 'Update own profile',
};
