import { LoggerService } from './../logger/logger.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import {
  AccessTokenStrategy,
  RefreshTokenStrategy
} from './token.jwt.strategy'
import { User, UserSchema } from 'src/schemas/users.schema'
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ]),
    JwtModule.register({}),
    ConfigModule
  ],
  controllers: [AuthController],
  providers: [
    LoggerService,
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    {
      provide: 'JWT_ACCESS_TOKEN_SECRET',
      useFactory: (configService: ConfigService) =>
        configService.get('jwt.accessTokenSecret'),
      inject: [ConfigService]
    },
    {
      provide: 'JWT_REFRESH_TOKEN_SECRET',
      useFactory: (configService: ConfigService) =>
        configService.get('jwt.refreshTokenSecret'),
      inject: [ConfigService]
    }
  ],
  exports: [MongooseModule, AuthService]
})
export class AuthModule {}
