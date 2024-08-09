import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthService } from '../auth/auth.service'
import { UsersService } from 'src/users/users.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService
  ) {}

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = request.headers['authorization']?.split(' ')[1]

    if (!token) {
      throw new UnauthorizedException(
        'You have no authority to do this.'
      )
    }

    try {
      const decoded = await this.authService.verifyToken(
        token,
        this.configService.get<string>('jwt.accessTokenSecret')
      )

      const auth = await this.usersService.getOne(
        decoded?.authId
      )
      if (!auth) {
        throw new UnauthorizedException(
          'Are you impersonating users?'
        )
      }

      request.auth = auth
      return true
    } catch (error) {
      throw new UnauthorizedException('Token is invalid.')
    }
  }
}
