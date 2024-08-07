// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt'
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>(
        'jwt.accessTokenSecret'
      )
    })
  }

  async validate(payload: any) {
    return { userId: payload._id, role: payload.role }
  }
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh'
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>(
        'jwt.refreshTokenSecret'
      )
    })
  }

  async validate(payload: any) {
    return { userId: payload._id, role: payload.role }
  }
}
