import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ApiConfigService } from '../shared/services/api-config.service';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceInterceptor.name);

  constructor(private readonly configService: ApiConfigService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Only enable monitoring in development environment
    if (!this.configService.isDevelopment) {
      return next.handle();
    }

    const start = Date.now();
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        const logLevel = this.getLogLevel(duration);

        this.logger[logLevel](
          `${request.method} ${request.url} - ${duration}ms`,
          {
            method: request.method,
            url: request.url,
            duration,
            userAgent: request.get('User-Agent'),
            ip: request.ip,
          },
        );
      }),
    );
  }

  private getLogLevel(duration: number): 'log' | 'warn' | 'error' {
    if (duration > 5000) {
      return 'error';
    }

    if (duration > 1000) {
      return 'warn';
    }

    return 'log';
  }
}
