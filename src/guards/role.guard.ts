import {
  Injectable,
  CanActivate,
  ExecutionContext
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from 'src/decorators/roles.decorator'
import { ERole } from 'src/interface/users.interface'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      ERole[]
    >(ROLES_KEY, [context.getHandler(), context.getClass()])
    if (!requiredRoles) {
      return true
    }
    const { auth } = context.switchToHttp().getRequest()
    return requiredRoles.some((role) =>
      auth.role?.includes(role)
    )
  }
}
