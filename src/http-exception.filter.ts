import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { LoggerService } from './logger/logger.service'
import { Request, Response } from 'express'
import { ConfigService } from '@nestjs/config'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: LoggerService,
    private readonly configService: ConfigService
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let status: number
    let message: string

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      message = exception.message
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR
      message = 'Internal server error'
    }

    if (exception instanceof Error) {
      if (
        exception.name === 'CastError' &&
        (exception as any).kind === 'ObjectId'
      ) {
        status = HttpStatus.NOT_FOUND
        message = 'Resource not found'
      }
    }

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      message:
        this.configService.get<string>('nodeEnv') ===
        'production'
          ? 'Something went wrong'
          : message,
      stack:
        this.configService.get<string>('nodeEnv') ===
        'production'
          ? null
          : (exception as Error).stack
    }

    this.logger.error(
      responseBody.message,
      AllExceptionsFilter.name
    )

    httpAdapter.reply(response, responseBody, status)
  }
}
