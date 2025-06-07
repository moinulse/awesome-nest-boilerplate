import { Column, Entity, Index, ManyToMany } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators/use-dto.decorator';
import { UserEntity } from '../../user/user.entity';
import { PermissionDto } from '../dto/permission.dto';
import { RoleEntity } from './role.entity';

@Entity({ name: 'permissions' })
@UseDto(PermissionDto)
export class PermissionEntity extends AbstractEntity<PermissionDto> {
  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  name!: string;

  @Column({ nullable: true, type: 'varchar', length: 500 })
  description?: string;

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles?: RoleEntity[];

  @Column({ type: 'boolean', default: false })
  isSystem?: boolean;

  @ManyToMany(() => UserEntity, (user) => user.directPermissions)
  users?: UserEntity[];
}
