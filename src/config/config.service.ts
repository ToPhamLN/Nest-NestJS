import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class CustomConfigService {
  constructor(private configService: ConfigService) {}

  getPort(): number {
    return this.configService.get<number>('PORT') || 3000
  }
  getJWTAccessKey(): string {
    return this.configService.get<string>('JWT_ACCESS_KEY')
  }
  getJWTRefreshKey(): string {
    return this.configService.get<string>('JWT_REFRESH_KEY')
  }
}
