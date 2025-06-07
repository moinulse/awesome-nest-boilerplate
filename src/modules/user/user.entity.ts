import { Expose, Type } from 'class-transformer';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  VirtualColumn,
} from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators/use-dto.decorator';
import { PermissionEntity } from '../iam/entities/permission.entity';
import { RoleEntity } from '../iam/entities/role.entity';
import { UserDto, type UserDtoOptions } from './dtos/user.dto';
import { UserSettingsEntity } from './user-settings.entity';

@Entity({ name: 'users' })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto, UserDtoOptions> {
  @Column({ nullable: true, type: 'varchar' })
  firstName!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  lastName!: string | null;

  @Type(() => RoleEntity)
  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles!: RoleEntity[];

  @Type(() => PermissionEntity)
  @ManyToMany(() => PermissionEntity, (permission) => permission.users)
  @JoinTable({
    name: 'user_permissions',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  directPermissions?: PermissionEntity[];

  @Column({ unique: true, nullable: true, type: 'varchar' })
  email!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  password!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  phone!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  avatar!: string | null;

  @VirtualColumn({
    query: (alias) =>
      `SELECT CONCAT(${alias}.first_name, ' ', ${alias}.last_name)`,
  })
  fullName!: string;

  @OneToOne(() => UserSettingsEntity, (userSettings) => userSettings.user)
  settings?: UserSettingsEntity;

  @Expose()
  computedPermissions?: string[];
}
