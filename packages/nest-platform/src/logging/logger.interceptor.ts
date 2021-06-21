import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from './logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = process.hrtime();

    return next
      .handle()
      .pipe(
        tap(() => {
          const [s, ns] = process.hrtime(start);
          const ms = ((s * 10e9) + ns) / 10e6;

          const http = context.switchToHttp();
          const req = http.getRequest();
          const res = http.getResponse();

          const controller = context.getClass().name;
          const handler = context.getHandler().name;

          this.logger.debug(`${req.method} ${req.path} ${res.statusCode} handled by ${controller}#${handler} in ${ms}ms`)
        }),
      );
  }
}
