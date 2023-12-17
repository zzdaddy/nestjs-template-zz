import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class CommonErrorCatchFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message;
    if (exception instanceof HttpException) {
      let res = exception.getResponse() as { message: string[] };
      message = res?.message?.join
        ? res?.message?.join(',')
        : exception.message;
    }
    response.status(statusCode).json({
      code: statusCode,
      message,
      error: 'Bad Request',
    });
  }
}
