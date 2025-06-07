import { StringField } from '../../../decorators';

export class RefreshTokenDto {
  @StringField()
  refreshToken!: string;
}
