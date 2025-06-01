import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionsGuard } from '../../guards/permissions.guard';
import { UserModule } from '../user/user.module';
import { PermissionEntity } from './entities/permission.entity';
import { RoleEntity } from './entities/role.entity';
import { IAMController } from './iam.controller';
import { IAMService } from './iam.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity, PermissionEntity]),
    // forwardRef(() => AuthModule), // Avoid circular dependency if possible
    forwardRef(() => UserModule),
  ],
  controllers: [IAMController],
  providers: [IAMService, PermissionsGuard],
  exports: [IAMService, PermissionsGuard],
})
export class IAMModule {}
