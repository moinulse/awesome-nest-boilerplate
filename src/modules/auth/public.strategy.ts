import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';

@Injectable()
export class PublicStrategy extends PassportStrategy(Strategy, 'public') {
  constructor() {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate(..._args: any[]): any {
    return null;
  }

  authenticate(): void {
    return this.success({ [Symbol.for('isPublic')]: true });
  }
}
