import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import {
  BooleanFieldOptional,
  EmailFieldOptional,
  StringFieldOptional,
} from '../../../decorators';
import { RoleDto } from '../../iam/dto/role.dto';
import { type UserEntity } from '../user.entity';

// TODO, remove this class and use constructor's second argument's type
export type UserDtoOptions = Partial<{ isActive: boolean }>;

export class UserDto extends AbstractDto {
  @StringFieldOptional({ nullable: true })
  firstName?: string | null;

  @StringFieldOptional({ nullable: true })
  lastName?: string | null;

  @StringFieldOptional({ nullable: true })
  username!: string;

  @ApiProperty({ type: () => RoleDto, isArray: true, nullable: true })
  @Type(() => RoleDto)
  roles?: RoleDto[] | null;

  @EmailFieldOptional({ nullable: true })
  email?: string | null;

  @StringFieldOptional({ nullable: true })
  avatar?: string | null;

  @BooleanFieldOptional()
  isActive?: boolean;

  constructor(user: UserEntity, options?: UserDtoOptions) {
    super(user);
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.roles = user.roles.map((role) => role.toDto());
    this.email = user.email;
    this.avatar = user.avatar;
    this.isActive = options?.isActive;
  }
}
