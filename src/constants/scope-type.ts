/**
 * Defines the resources or areas within the application that permissions can apply to.
 * These are typically combined with a PermissionType to form a specific permission
 * (e.g., CREATE_POST, READ_USER, DELETE_OWN_COMMENT).
 *
 * Use broad categories or specific entity names.
 * 'ALL' can represent global permissions.
 * 'OWN' can be used in logic to denote permissions limited to the user's own resources.
 */
export enum ScopeType {
  // Entities
  USER = 'USER',
  POST = 'POST',
  // Add other entities like COMMENT, PROFILE, etc.

  // Features/Areas
  SETTINGS = 'SETTINGS',
  IAM = 'IAM', // For managing roles/permissions itself
  // Add other feature areas

  // Special Scopes
  ALL = 'ALL', // Represents global scope (use with caution)
  OWN = 'OWN', // Represents scope limited to the user's own resources (used in guard logic)
}
