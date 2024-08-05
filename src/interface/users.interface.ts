export enum ERole {
  ADMIN = 'Admin',
  USER = 'User'
}
export type TUser = {
  email: string
  username: string
  password: string
  role: ERole
}

export type TBodyRequest = {
  email: string
  username: string
  password: string
}

export type TMultipleFiles = {
  avatar?: Express.Multer.File[]
  background?: Express.Multer.File[]
}
