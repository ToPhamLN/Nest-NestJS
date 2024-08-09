import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Get,
  Req,
  Ip
} from '@nestjs/common'
import { AuthService } from './auth.service'
import RegisterDto from './dto/register.dto'
import { Response, Request } from 'express'
import { SkipThrottle } from '@nestjs/throttler'
import { LoggerService } from '../logger/logger.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: LoggerService
  ) {}

  @SkipThrottle()
  @Post('/register')
  async register(
    @Ip() ip: string,
    @Body() registerDto: RegisterDto,
    @Res() res: Response
  ) {
    try {
      this.logger.log(`Register user by\t${ip}`)
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
      throw error
    }
  }

  @Post('/login')
  async login(
    @Body() registerDto: RegisterDto,
    @Res() res: Response
  ) {
    try {
      const { auth, refreshToken } =
        await this.authService.signIn(registerDto)

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict'
      })

      return res.status(HttpStatus.OK).json({
        auth,
        message: 'Login successfully'
      })
    } catch (error) {
      throw error
    }
  }

  @Get('/refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    try {
      const { accessToken, refreshToken } =
        await this.authService.refresh(req.cookies.refreshToken)
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict'
      })
      return res.status(HttpStatus.OK).json({
        accessToken,
        message: 'Refresh token successfully'
      })
    } catch (error) {
      throw error
    }
  }

  @Get('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      const { message } = await this.authService.logout(
        req.cookies.refreshToken
      )
      res.clearCookie('refreshToken')
      res.status(HttpStatus.OK).json({ message })
    } catch (error) {
      throw error
    }
  }
}
