import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { CustomConfigService } from './config/config.service'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from './users/users.module'

const Config = ConfigModule.forRoot({
  isGlobal: true
})
const Mongoose = MongooseModule.forRoot(process.env.MONGOOSE_URI)

@Module({
  imports: [Config, Mongoose, UsersModule],
  controllers: [AppController],
  providers: [CustomConfigService, AppService]
})
export class AppModule {}
