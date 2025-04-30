/**
 * Defines the types of actions that can be permitted.
 * These are typically combined with a ScopeType to form a specific permission
 * (e.g., CREATE_POST, READ_USER, DELETE_OWN_COMMENT).
 */
export enum PermissionType {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  // Add other specific actions as needed, e.g., EXECUTE, MANAGE_ROLES
}
