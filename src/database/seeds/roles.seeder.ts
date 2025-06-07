/* eslint-disable no-await-in-loop */
import { Logger } from '@nestjs/common';
import type { DataSource } from 'typeorm';
import { In } from 'typeorm';
import type { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { Permission } from '../../constants/permissions.enum';
import { PermissionEntity } from '../../modules/iam/entities/permission.entity';
import { RoleEntity } from '../../modules/iam/entities/role.entity';

interface IRoleSeedData {
  name: string;
  description: string;
  permissions: Permission[];
}

export default class RolesSeeder implements Seeder {
  private readonly logger = new Logger(RolesSeeder.name);

  public async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const roleRepository = dataSource.getRepository(RoleEntity);
    const permissionRepository = dataSource.getRepository(PermissionEntity);

    // Define role configurations
    const roleConfigs: IRoleSeedData[] = [
      {
        name: 'user',
        description: 'Standard user with basic permissions',
        permissions: [
          Permission.PROFILE_READ,
          Permission.PROFILE_UPDATE,

          Permission.AUTH_REFRESH,

          Permission.USER_READ,
        ],
      },
      {
        name: 'moderator',
        description: 'Moderator with user management permissions',
        permissions: [
          // User management (limited)
          Permission.USER_READ,
          Permission.USER_LIST,
          Permission.USER_UPDATE, // Can update other users

          // Role read access
          Permission.ROLE_READ,
          Permission.ROLE_LIST,

          // Permission read access
          Permission.PERMISSION_READ,
          Permission.PERMISSION_LIST,

          // Health monitoring
          Permission.HEALTH_READ,

          // Auth permissions
          Permission.AUTH_REFRESH,
          Permission.AUTH_LOGOUT,

          // Profile permissions
          Permission.PROFILE_READ,
          Permission.PROFILE_UPDATE,
        ],
      },
      {
        name: 'admin',
        description: 'Administrator with full system access',
        permissions: [
          // All user management
          Permission.USER_READ,
          Permission.USER_CREATE,
          Permission.USER_UPDATE,
          Permission.USER_DELETE,
          Permission.USER_LIST,

          // All role management
          Permission.ROLE_READ,
          Permission.ROLE_MANAGE,
          Permission.ROLE_LIST,
          Permission.ROLE_ASSIGN,

          // All permission management
          Permission.PERMISSION_READ,
          Permission.PERMISSION_MANAGE,
          Permission.PERMISSION_LIST,
          Permission.PERMISSION_ASSIGN,

          // System administration
          Permission.SYSTEM_ADMIN,
          Permission.SYSTEM_SETTINGS,
          Permission.SYSTEM_LOGS,
          Permission.SYSTEM_MAINTENANCE,

          // Audit capabilities
          Permission.AUDIT_READ,
          Permission.AUDIT_EXPORT,

          // Health monitoring
          Permission.HEALTH_READ,

          // Auth permissions
          Permission.AUTH_REFRESH,
          Permission.AUTH_LOGOUT,

          // Profile permissions
          Permission.PROFILE_READ,
          Permission.PROFILE_UPDATE,
        ],
      },
    ];

    for (const roleConfig of roleConfigs) {
      // Check if role already exists
      let role = await roleRepository.findOne({
        where: { name: roleConfig.name },
        relations: ['permissions'],
      });

      // Get permissions by names
      const permissions = await permissionRepository.find({
        where: { name: In(roleConfig.permissions) },
      });

      if (permissions.length !== roleConfig.permissions.length) {
        const foundPermissionNames = permissions.map((p) => p.name);
        const missingPermissions = roleConfig.permissions.filter(
          (p) => !foundPermissionNames.includes(p),
        );
        this.logger.warn(
          `⚠️  Missing permissions for role ${roleConfig.name}:`,
          missingPermissions,
        );
      }

      if (!role) {
        // Create new role
        role = roleRepository.create({
          name: roleConfig.name,
          description: roleConfig.description,
          permissions,
        });
        await roleRepository.save(role);
        this.logger.log(
          `✅ Created role: ${roleConfig.name} with ${permissions.length} permissions`,
        );
      } else {
        // Update existing role's permissions
        role.permissions = permissions;
        role.description = roleConfig.description;
        await roleRepository.save(role);
        this.logger.log(
          `✅ Updated role: ${roleConfig.name} with ${permissions.length} permissions`,
        );
      }
    }

    this.logger.log('✅ Roles seeding completed successfully!');
  }
}
