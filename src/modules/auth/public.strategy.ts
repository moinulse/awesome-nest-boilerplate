import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';

@Injectable()
export class PublicStrategy extends PassportStrategy(Strategy, 'public') {
  constructor() {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, unused-imports/no-unused-vars
  validate(..._args: any[]): any {
    return null;
  }

  authenticate(): void {
    return this.success({ [Symbol.for('isPublic')]: true });
  }
}
