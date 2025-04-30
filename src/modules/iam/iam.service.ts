import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { CreatePermissionDto } from './dto/create-permission.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PermissionEntity } from './entities/permission.entity';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class IAMService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
  ) {}

  @Transactional()
  async createRole(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const { name, description, permissionIds } = createRoleDto;
    let permissions: PermissionEntity[] = [];

    if (permissionIds && permissionIds.length > 0) {
      permissions = await this.findPermissionsByIds(permissionIds as Uuid[]);
    }

    const role = this.roleRepository.create({ name, description, permissions });

    return this.roleRepository.save(role);
  }

  async findAllRoles(): Promise<RoleEntity[]> {
    return this.roleRepository.find({ relations: ['permissions'] });
  }

  async findRoleById(id: string): Promise<RoleEntity> {
    const role = await this.roleRepository.findOne({
      where: { id: id as Uuid },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async findRoleByName(name: string): Promise<RoleEntity | null> {
    return this.roleRepository.findOne({
      where: { name },
      relations: ['permissions'],
    });
  }

  @Transactional()
  async updateRole(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleEntity> {
    const role = await this.findRoleById(id);
    const { name, description, permissionIds } = updateRoleDto;

    if (permissionIds !== undefined) {
      role.permissions =
        permissionIds.length > 0
          ? await this.findPermissionsByIds(permissionIds as Uuid[])
          : [];
    }

    role.name = name === undefined ? role.name : name;

    role.description =
      description === undefined ? role.description : description;

    return this.roleRepository.save(role);
  }

  async deleteRole(id: string): Promise<void> {
    const result = await this.roleRepository.delete(id as Uuid);

    if (result.affected === 0) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
  }

  async createPermission(
    createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionEntity> {
    const existing = await this.permissionRepository.findOneBy({
      name: createPermissionDto.name,
    });

    if (existing) {
      throw new ConflictException(
        `Permission with name "${createPermissionDto.name}" already exists`,
      );
    }

    const permission = this.permissionRepository.create(createPermissionDto);

    return this.permissionRepository.save(permission);
  }

  async findAllPermissions(): Promise<PermissionEntity[]> {
    return this.permissionRepository.find();
  }

  async findPermissionById(id: string): Promise<PermissionEntity> {
    const permission = await this.permissionRepository.findOneBy({
      id: id as Uuid,
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    return permission;
  }

  async findPermissionsByIds(ids: Uuid[]): Promise<PermissionEntity[]> {
    if (ids.length === 0) {
      return [];
    }

    return this.permissionRepository.findBy({ id: In(ids) });
  }

  // --- Utility ---

  /**
   * Retrieves all unique permission names associated with a user through their roles.
   * @param userId The ID of the user.
   * @returns A promise resolving to an array of unique permission names.
   */
  async getPermissionsForUser(userId: Uuid): Promise<string[]> {
    const userWithRolesAndPermissions = await this.roleRepository.manager
      .getRepository(RoleEntity)
      .createQueryBuilder('role')
      .innerJoin('role.users', 'user', 'user.id = :userId', { userId })
      .leftJoinAndSelect('role.permissions', 'permission')
      .getMany();

    const permissionNames = userWithRolesAndPermissions.flatMap((role) =>
      role.permissions.map((p) => p.name),
    );

    return [...new Set(permissionNames)];
  }
}
