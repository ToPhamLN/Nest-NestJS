import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class CustomConfigService {
  constructor(private configService: ConfigService) {}

  getPort(): number {
    return this.configService.get<number>('PORT') || 3000
  }
}