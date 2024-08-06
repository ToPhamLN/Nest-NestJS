import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { CustomConfigService } from './config/config.service'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';

const Config = ConfigModule.forRoot({
  isGlobal: true
})
const Mongoose = MongooseModule.forRoot(process.env.MONGOOSE_URI)

@Module({
  imports: [Config, Mongoose, AuthModule, UsersModule],
  controllers: [AppController, UsersController],
  providers: [CustomConfigService, AppService, AuthService]
})
export class AppModule {}
