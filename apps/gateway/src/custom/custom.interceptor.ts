import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class HttpCommonInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();
    // 201时返回200
    if (response.statusCode === HttpStatus.CREATED)
      response.status(HttpStatus.OK);
    return next.handle().pipe(
      map((data) => {
        return {
          code: 200,
          data,
          message: 'ok',
        };
      }),
    );
  }
}
