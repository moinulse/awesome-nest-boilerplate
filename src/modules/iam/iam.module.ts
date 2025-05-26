import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RBACGuard } from '../../guards/rbac.guard';
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
  providers: [IAMService, RBACGuard],
  exports: [IAMService, RBACGuard],
})
export class IAMModule {}
