import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoleEntity } from './role.entity';
import { PermissionEntity } from './permission.entity';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class RbacService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
  ) {}

  async assignRoleToUser(user: UserEntity, roleName: string): Promise<void> {
    const role = await this.roleRepository.findOne({ where: { name: roleName } });
    if (!role) {
      throw new Error(`Role ${roleName} not found`);
    }
    user.role = role;
    await this.roleRepository.save(user);
  }

  async checkPermission(user: UserEntity, permissionName: string): Promise<boolean> {
    const permissions = await this.permissionRepository.find({
      where: { roles: { id: user.role.id } },
    });
    return permissions.some((permission) => permission.name === permissionName);
  }
}
