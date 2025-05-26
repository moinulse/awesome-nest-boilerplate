// import { NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { PermissionEntity } from './entities/permission.entity';
import { RoleEntity } from './entities/role.entity';
// import { type Repository } from 'typeorm';
import { IAMService } from './iam.service';

// Mock TypeORM repository methods
const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  findByIds: jest.fn(), // Mock findByIds
  delete: jest.fn(),
});

describe('IAMService', () => {
  let service: IAMService;
  // let roleRepository: Repository<RoleEntity>;
  // let permissionRepository: Repository<PermissionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IAMService,
        {
          provide: getRepositoryToken(RoleEntity),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(PermissionEntity),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<IAMService>(IAMService);
    // roleRepository = module.get<Repository<RoleEntity>>(
    //   getRepositoryToken(RoleEntity),
    // );
    // permissionRepository = module.get<Repository<PermissionEntity>>(
    //   getRepositoryToken(PermissionEntity),
    // );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Role Tests ---
  // describe('createRole', () => {
  //   it('should create and return a role without permissions', async () => {
  //     const createDto = { name: 'TestRole', description: 'A test role' };
  //     const expectedRole = { id: 'uuid', ...createDto, permissions: [] };

  //     jest.spyOn(permissionRepository, 'findByIds').mockResolvedValue([]);
  //     jest.spyOn(roleRepository, 'create').mockReturnValue(expectedRole as any);
  //     jest.spyOn(roleRepository, 'save').mockResolvedValue(expectedRole as any);

  //     const result = await service.createRole(createDto);
  //     expect(result).toEqual(expectedRole);
  //     expect(permissionRepository.findByIds).not.toHaveBeenCalled();
  //     expect(roleRepository.create).toHaveBeenCalledWith({
  //       name: createDto.name,
  //       description: createDto.description,
  //       permissions: [],
  //     });
  //     expect(roleRepository.save).toHaveBeenCalledWith(expectedRole);
  //   });

  //   it('should create and return a role with permissions', async () => {
  //     const perm1 = { id: 'p1', name: 'perm1' } as PermissionEntity;
  //     const perm2 = { id: 'p2', name: 'perm2' } as PermissionEntity;
  //     const createDto = {
  //       name: 'TestRole',
  //       description: 'A test role',
  //       permissionIds: ['p1', 'p2'],
  //     };
  //     const expectedRole = {
  //       id: 'uuid',
  //       ...createDto,
  //       permissions: [perm1, perm2],
  //     };

  //     jest
  //       .spyOn(permissionRepository, 'findByIds')
  //       .mockResolvedValue([perm1, perm2]);
  //     jest.spyOn(roleRepository, 'create').mockReturnValue(expectedRole as any);
  //     jest.spyOn(roleRepository, 'save').mockResolvedValue(expectedRole as any);

  //     const result = await service.createRole(createDto);
  //     expect(result).toEqual(expectedRole);
  //     expect(permissionRepository.findByIds).toHaveBeenCalledWith(['p1', 'p2']);
  //     expect(roleRepository.create).toHaveBeenCalledWith({
  //       name: createDto.name,
  //       description: createDto.description,
  //       permissions: [perm1, perm2],
  //     });
  //     expect(roleRepository.save).toHaveBeenCalledWith(expectedRole);
  //   });
  // });

  // describe('findRoleById', () => {
  //   it('should find and return a role by id', async () => {
  //     const roleId = 'test-uuid';
  //     const expectedRole = { id: roleId, name: 'FoundRole' } as RoleEntity;
  //     jest.spyOn(roleRepository, 'findOne').mockResolvedValue(expectedRole);

  //     const result = await service.findRoleById(roleId);
  //     expect(result).toEqual(expectedRole);
  //     expect(roleRepository.findOne).toHaveBeenCalledWith({
  //       where: { id: roleId },
  //       relations: ['permissions'],
  //     });
  //   });

  //   it('should throw NotFoundException if role not found', async () => {
  //     const roleId = 'non-existent-uuid';
  //     jest.spyOn(roleRepository, 'findOne').mockResolvedValue(null);

  //     await expect(service.findRoleById(roleId)).rejects.toThrow(
  //       NotFoundException,
  //     );
  //   });
  // });

  // // --- Permission Tests ---
  // describe('createPermission', () => {
  //   it('should create and return a permission', async () => {
  //     const createDto = {
  //       name: 'TestPermission',
  //       description: 'A test permission',
  //     };
  //     const expectedPermission = { id: 'uuid', ...createDto };

  //     jest
  //       .spyOn(permissionRepository, 'create')
  //       .mockReturnValue(expectedPermission as any);
  //     jest
  //       .spyOn(permissionRepository, 'save')
  //       .mockResolvedValue(expectedPermission as any);

  //     const result = await service.createPermission(createDto);
  //     expect(result).toEqual(expectedPermission);
  //     expect(permissionRepository.create).toHaveBeenCalledWith(createDto);
  //     expect(permissionRepository.save).toHaveBeenCalledWith(
  //       expectedPermission,
  //     );
  //   });
  // });

  // Add more tests for other service methods (findAllRoles, updateRole, deleteRole, findAllPermissions, etc.)
});
