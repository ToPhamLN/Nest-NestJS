import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/schemas/users.schema'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LoggerService } from 'src/logger/logger.service'
import { JwtAuthGuard } from 'src/guards/jwt.guard'
import { RolesGuard } from 'src/guards/role.guard'
import { AuthService } from 'src/auth/auth.service'
import { JwtService } from '@nestjs/jwt'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ]),
    ConfigModule
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    LoggerService,
    JwtAuthGuard,
    RolesGuard,
    AuthService,
    ConfigService,
    JwtService
  ],
  exports: [MongooseModule, UsersService]
})
export class UsersModule {}
