import { IsOptional, IsPositive } from 'class-validator'
export class ListAllQuery {
  @IsOptional()
  @IsPositive()
  limit: number

  @IsOptional()
  @IsPositive()
  page: number

  @IsOptional()
  @IsPositive()
  username: string
}

export class UpdateOne {
  @IsOptional()
  @IsPositive()
  newPassword: string

  @IsOptional()
  @IsPositive()
  oldPassword: string

  @IsOptional()
  @IsPositive()
  email: string

  @IsOptional()
  @IsPositive()
  username: string
}
