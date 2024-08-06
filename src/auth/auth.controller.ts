import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Next,
  Post,
  Req,
  Res
} from '@nestjs/common'
import { AuthService } from './auth.service'
import RegisterDto from './dto/register.dto'
import { Response, Request, NextFunction } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Req() req: Request, @Res() res: Response) {
    const { auth, refreshToken } = await this.authService.
    throw new Error('mda')
    res.status(200).json({ message: 'oke' })
  }
}
