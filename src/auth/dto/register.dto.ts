import { IsEmail, IsNotEmpty } from 'class-validator'

export default class RegisterDto {
  @IsEmail()
  email: string

  @IsNotEmpty()
  username: string

  @IsNotEmpty()
  password: string
}
