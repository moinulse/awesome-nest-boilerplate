import { Column, Entity, ManyToMany, JoinTable } from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';
import { PermissionEntity } from './permission.entity';

@Entity({ name: 'roles' })
export class RoleEntity extends AbstractEntity<RoleEntity> {
  @Column({ unique: true })
  name!: string;

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions!: PermissionEntity[];
}
