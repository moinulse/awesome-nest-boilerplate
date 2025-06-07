import { NumberField, StringField } from '../../../decorators';

export class TokenPayloadDto {
  @NumberField()
  expiresIn: number;

  @StringField()
  accessToken: string;

  @StringField()
  refreshToken: string;

  constructor(data: {
    expiresIn: number;
    accessToken: string;
    refreshToken: string;
  }) {
    this.expiresIn = data.expiresIn;
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
  }
}
