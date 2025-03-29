import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RbacService } from './rbac.service';
import { RoleEntity } from './role.entity';
import { PermissionEntity } from './permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, PermissionEntity])],
  providers: [RbacService],
  exports: [RbacService],
})
export class RbacModule {}
