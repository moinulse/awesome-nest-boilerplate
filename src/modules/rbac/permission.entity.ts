import { Column, Entity, ManyToMany } from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';
import { RoleEntity } from './role.entity';

@Entity({ name: 'permissions' })
export class PermissionEntity extends AbstractEntity<PermissionEntity> {
  @Column({ unique: true })
  name!: string;

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles!: RoleEntity[];
}
