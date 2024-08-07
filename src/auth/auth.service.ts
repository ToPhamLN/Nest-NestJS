import { ConflictException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import RegisterDto from './dto/register.dto'
import { InjectModel } from '@nestjs/mongoose'
import { User } from 'src/schemas/users.schema'
import { Model, Types } from 'mongoose'
import bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, username } = registerDto

    const existAuth = await this.userModel.findOne({ email })

    if (existAuth) {
      throw new ConflictException('Email này đã tồn tại')
    }

    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)

    const newAuth = new this.userModel({
      email,
      password: hashed,
      username
    })
    const auth = await newAuth.save()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: omitPassword, ...other } = auth.toObject()
    const accessToken = this.generateAccessToken(
      auth._id,
      auth.role
    )
    const refreshToken = this.generateRefreshToken(
      auth._id,
      auth.role
    )

    return { auth: { ...other, accessToken }, refreshToken }
  }

  async generateAccessToken(
    userId: Types.ObjectId,
    role: string
  ) {
    const payload = { userId, role }

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(
        'jwt.accessTokenSecret'
      ),
      expiresIn: this.configService.get<string>(
        'jwt.accessTokenExpiresIn'
      )
    })
  }

  async generateRefreshToken(
    userId: Types.ObjectId,
    role: string
  ) {
    const payload = { userId, role }
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(
        'jwt.refreshTokenSecret'
      ),
      expiresIn: this.configService.get<string>(
        'jwt.refreshTokenExpiresIn'
      )
    })
  }

  async verifyToken(token: string, secret: string) {
    return this.jwtService.verify(token, { secret })
  }
}
