import { Global, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthService } from './auth/auth.service'
import { AuthModule } from './auth/auth.module'
import { UsersController } from './users/users.controller'
import { UsersModule } from './users/users.module'
import nodeConfig from './config/node.config'
import jwtConfig from './config/jwt.config'
import { JwtService } from '@nestjs/jwt'
import {
  ThrottlerModule,
  ThrottlerGuard
} from '@nestjs/throttler'
import { LoggerModule } from './logger/logger.module'
import { LoggerService } from './logger/logger.service'
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [nodeConfig, jwtConfig]
    }),
    MongooseModule.forRoot(process.env.MONGOOSE_URL),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 3
      }
    ]),
    AuthModule,
    UsersModule,
    LoggerModule
  ],
  controllers: [AppController, UsersController],
  providers: [
    AppService,
    AuthService,
    JwtService,
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard
    },
    LoggerService
  ]
})
export class AppModule {}
