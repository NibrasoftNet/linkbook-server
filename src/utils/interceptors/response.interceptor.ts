import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)),
      catchError((err: HttpException) =>
        throwError(() => this.errorHandler(err, context)),
      ),
    );
  }

  errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      !!exception && typeof exception['getStatus'] === 'function'
        ? exception.getStatus()
        : 500;
    let errorMessage: string;
    if (!!exception && typeof exception['getStatus'] === 'function') {
      if (typeof response == 'string') {
        errorMessage = response;
      } else if (typeof exception['response'] == 'string') {
        errorMessage =
          exception.getStatus() !== 500
            ? exception['response']
            : JSON.stringify({ httpEntityException: exception['response'] });
      } else {
        errorMessage = JSON.stringify(exception['response']['errors']);
      }
    } else {
      errorMessage = exception.message;
    }
    response.status(status).json({
      status: false,
      statusCode: status,
      path: request.url,
      message: errorMessage,
      stack: exception.stack,
    });
  }

  responseHandler(res: any, context: ExecutionContext) {
    try {
      const ctx = context.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
      const statusCode = response.statusCode;

      return {
        status: true,
        path: request.url,
        statusCode: statusCode,
        result: res,
      };
    } catch (e) {
      console.log(e);
    }
  }
}
