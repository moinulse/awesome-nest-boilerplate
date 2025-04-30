import { AbstractDto } from '../../../common/dto/abstract.dto';
import { StringField, StringFieldOptional } from '../../../decorators';
import { type PermissionEntity } from '../entities/permission.entity';

export class PermissionDto extends AbstractDto {
  @StringField()
  name: string;

  @StringFieldOptional()
  description?: string;

  constructor(permission: PermissionEntity) {
    super(permission);
    this.name = permission.name;
    this.description = permission.description;
  }
}
