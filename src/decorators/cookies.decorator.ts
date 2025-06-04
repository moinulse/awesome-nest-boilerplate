import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

export function Cookies(cookieName?: string) {
  return createParamDecorator((_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return cookieName ? request.cookies?.[cookieName] : request.cookies;
  })();
}
