import { ConflictException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import RegisterDto from './dto/register.dto'
import { InjectModel } from '@nestjs/mongoose'
import { User } from 'src/schemas/users.schema'
import { Model } from 'mongoose'
import bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto

    const existAuth = await this.userModel.findOne({ email })

    if (existAuth) {
      throw new ConflictException('Email này đã tồn tại')
    }

    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)

    const newAuth = new this.userModel({
      email,
      password: hashed
    })
    const auth = await newAuth.save()

    // Omit the password from the response
    const { password: _, ...other } = auth.toObject()
    const accessToken = generateAccessToken(auth)
    const refreshToken = generateRefreshToken(auth)

    return { auth: { ...other, accessToken }, refreshToken }
  }

  async generateTokens(userId: string, role: string) {
    const payload = { userId, username }

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(
        'jwt.accessTokenSecret'
      ),
      expiresIn: this.configService.get<string>(
        'jwt.accessTokenExpiresIn'
      )
    })

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(
        'jwt.refreshTokenSecret'
      ),
      expiresIn: this.configService.get<string>(
        'jwt.refreshTokenExpiresIn'
      )
    })

    return { accessToken, refreshToken }
  }

  async verifyToken(token: string, secret: string) {
    return this.jwtService.verify(token, { secret })
  }
}
