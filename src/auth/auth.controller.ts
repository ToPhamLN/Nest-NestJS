import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { RefreshTokenGuard } from './token.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDto: any) {
    const { userId, username } = loginDto
    const user = await this.authService.register(loginDto)
    return this.authService.generateTokens(userId, username)
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  async refresh(@Req() req) {
    const user = req.user
    return this.authService.generateTokens(
      user.userId,
      user.username
    )
  }
}
