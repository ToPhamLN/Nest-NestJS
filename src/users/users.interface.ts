export enum ERole {
  ADMIN = 'admin',
  USER = 'user'
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
