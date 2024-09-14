import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { WinstonLoggerService } from '../../logger/winston-logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: WinstonLoggerService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    this.errorHandler(exception, host);
  }

  errorHandler(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      !!exception && typeof exception['getStatus'] === 'function'
        ? exception.getStatus()
        : 500;
    let errorMessage: string;
    if (!!exception && typeof exception['getStatus'] === 'function') {
      if (typeof exception['response'] == 'string') {
        errorMessage =
          exception.getStatus() !== 500
            ? exception['response']
            : JSON.stringify({ httpEntityException: exception['response'] });
      } else {
        errorMessage =
          JSON.stringify(exception['response']['errors']) ??
          exception['response']['message'];
      }
    } else {
      errorMessage = exception.message;
    }

    this.loggerService.error(request.url, {
      description: request.url,
      class: HttpException.name,
      function: 'exception',
      exception,
    });

    response.status(status).json({
      status: false,
      statusCode: status,
      path: request.url,
      message: errorMessage,
      stack: exception.stack,
    });
  }

  responseHandler(exception: HttpException, host: ArgumentsHost) {
    try {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
      const statusCode = response.statusCode;
      this.loggerService.error(request.url, exception);
      response.status(statusCode).json({
        timestamp: new Date().toISOString(),
        path: request.url,
        statusCode: statusCode,
      });
    } catch (e) {
      this.loggerService.error('Response handler in HttpExceptionFilter', e);
    }
  }
}
