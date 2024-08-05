import { Injectable } from '@nestjs/common'
import { TBodyRequest, TMultipleFiles } from '../interface/users.interface'
import { deleteImage } from 'src/utils/util.helper'
import { User } from 'src/schemas/users.schema'
import { Model } from 'mongoose'

@Injectable()
export class UsersService {
  constructor(@Injectable(User.name) private userModel: Model<User>) {}
  createUser(body: TBodyRequest, files: Array<Express.Multer.File>) {
    console.log(files)
    deleteImage('avatar-1722842840040-701436807.jpg')
    return body
  }

  updateUser(id: string, body: TBodyRequest, files: TMultipleFiles) {
    console.log(files)
    return { id, body }
  }
}
