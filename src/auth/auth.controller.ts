import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus
} from '@nestjs/common'
import { AuthService } from './auth.service'
import RegisterDto from './dto/register.dto'
import { Response } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async login(
    @Body() registerDto: RegisterDto,
    @Res() res: Response
  ) {
    try {
      const { auth, refreshToken } =
        await this.authService.register(registerDto)

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict'
      })

      return res.status(HttpStatus.OK).json({
        auth
      })
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message })
    }
  }
}
