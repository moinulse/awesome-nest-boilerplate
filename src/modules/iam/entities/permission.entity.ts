import { Column, Entity, Index, ManyToMany } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators/use-dto.decorator';
import { PermissionDto } from '../dto/permission.dto';
import { RoleEntity } from './role.entity';

@Entity({ name: 'permissions' })
@UseDto(PermissionDto)
export class PermissionEntity extends AbstractEntity<PermissionDto> {
  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles!: RoleEntity[];
}
