import { Logger } from '@nestjs/common';
import { type DataSource } from 'typeorm';
import { type Seeder, type SeederFactoryManager } from 'typeorm-extension';

import {
  Permission,
  PERMISSION_DESCRIPTIONS,
} from '../../constants/permissions.enum';
import { PermissionEntity } from '../../modules/iam/entities/permission.entity';

export default class PermissionsSeeder implements Seeder {
  private readonly logger = new Logger(PermissionsSeeder.name);

  public async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const permissionRepository = dataSource.getRepository(PermissionEntity);

    // Prepare permission data
    const permissionsData = Object.values(Permission).map((permission) => ({
      name: permission,
      description: PERMISSION_DESCRIPTIONS[permission],
      isSystem: true,
    }));

    // Get all existing permissions at once
    const existingPermissions = await permissionRepository.find();
    const existingPermissionMap = new Map(
      existingPermissions.map((p) => [p.name, p]),
    );

    const permissionsToCreate: Array<{
      name: Permission;
      description: string;
      isSystem: boolean;
    }> = [];
    const permissionsToUpdate: PermissionEntity[] = [];

    // Categorize permissions for batch operations
    for (const permissionData of permissionsData) {
      const existingPermission = existingPermissionMap.get(permissionData.name);

      if (!existingPermission) {
        permissionsToCreate.push(permissionData);
      } else if (
        existingPermission.description !== permissionData.description
      ) {
        existingPermission.description = permissionData.description;
        permissionsToUpdate.push(existingPermission);
      }
    }

    // Batch create new permissions
    if (permissionsToCreate.length > 0) {
      const newPermissions = permissionRepository.create(permissionsToCreate);
      await permissionRepository.save(newPermissions);
      this.logger.log(
        `✅ Created ${permissionsToCreate.length} new permissions`,
      );
    }

    // Batch update existing permissions
    if (permissionsToUpdate.length > 0) {
      await permissionRepository.save(permissionsToUpdate);
      this.logger.log(`✅ Updated ${permissionsToUpdate.length} permissions`);
    }

    this.logger.log('✅ Permissions seeding completed successfully!');
  }
}
