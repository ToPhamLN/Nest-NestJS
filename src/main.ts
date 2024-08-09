import { NestFactory, HttpAdapterHost } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import cookieParser from 'cookie-parser'
import { LoggerService } from './logger/logger.service'
// import csurf from 'csurf'
import helmet from 'helmet'
import { AllExceptionsFilter } from './http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const httpAdapter = app.get(HttpAdapterHost)
  app.useGlobalFilters(
    new AllExceptionsFilter(
      httpAdapter,
      new LoggerService(),
      new ConfigService()
    )
  )
  app.enableCors({
    origin: configService.get<string>('CLIENT_URL'),
    credentials: true
  })
  app.useGlobalPipes()

  app.use(cookieParser())
  // app.use(csurf({ cookie: true }))
  app.use(helmet())
  app.setGlobalPrefix('api/v1')
  const port = configService.get<number>('PORT')
  await app.listen(port)
  console.log(
    `Application is running on: http://localhost:${port}`
  )
}
bootstrap()
