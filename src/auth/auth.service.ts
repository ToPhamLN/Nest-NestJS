import { ConflictException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import RegisterDto from './dto/register.dto'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from 'src/schemas/users.schema'
import { Model } from 'mongoose'
import bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  private refreshTokens: string[] = []
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, username } = registerDto

    const existAuth = await this.userModel.findOne({ email })

    if (existAuth) {
      throw new ConflictException('Email already exists')
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
    const accessToken = await this.generateAccessToken(auth)
    const refreshToken = await this.generateRefreshToken(auth)
    this.refreshTokens.push(refreshToken)

    return { auth: { ...other, accessToken }, refreshToken }
  }

  async signIn(registerDto: RegisterDto) {
    const { email, password } = registerDto

    const existAuth = await this.userModel.findOne({ email })
    if (!existAuth) {
      throw new ConflictException('Email not found')
    }

    const isMatch = await bcrypt.compare(
      password,
      existAuth.password
    )
    if (!isMatch) {
      throw new ConflictException('Password is incorrect')
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: omitPassword, ...other } =
      existAuth.toObject()
    const accessToken = await this.generateAccessToken(existAuth)
    const refreshToken =
      await this.generateRefreshToken(existAuth)
    this.refreshTokens.push(refreshToken)

    return { auth: { ...other, accessToken }, refreshToken }
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new ConflictException("You're not authenticated. ")
    }
    if (!this.refreshTokens.includes(refreshToken)) {
      throw new ConflictException('Refresh token is not valid. ')
    }

    const user = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_KEY
    })

    this.refreshTokens = this.refreshTokens.filter(
      (token) => token !== refreshToken
    )
    const newAccessToken = await this.generateAccessToken(user)
    const newRefreshToken = await this.generateRefreshToken(user)
    this.refreshTokens.push(newRefreshToken)

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  }
  async logout(refreshToken: string): Promise<any> {
    this.refreshTokens = this.refreshTokens.filter(
      (tokenItem) => tokenItem !== refreshToken
    )
    return { message: 'Logged out successfully!' }
  }

  async generateAccessToken(auth: UserDocument) {
    const payload = { userId: auth?._id, role: auth?.role }

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(
        'jwt.accessTokenSecret'
      ),
      expiresIn: this.configService.get<string>(
        'jwt.accessTokenExpiresIn'
      )
    })
  }

  async generateRefreshToken(auth: UserDocument) {
    const payload = { userId: auth?._id, role: auth?.role }

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
    console.log(token, secret)
    return this.jwtService.verify(token, { secret })
  }
}
