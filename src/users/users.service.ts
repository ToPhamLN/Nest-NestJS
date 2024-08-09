import { ConflictException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from '../schemas/users.schema'
import { ListAllQuery, UpdateOne } from './dto'
import bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>
  ) {}

  async getAll(query: ListAllQuery) {
    const { page, limit, username } = query
    const queryObject = {}

    if (username) {
      queryObject['username'] = {
        $regex: `.*${username}*.`,
        $options: 'i'
      }
    }

    const users = await this.userModel
      .find(queryObject)
      .skip(page * limit)
      .limit(limit)
    const total =
      await this.userModel.countDocuments(queryObject)

    return {
      users,
      total
    }
  }

  async getOne(id: string) {
    return await this.userModel.findById(id)
  }

  async getOneByEmail(email: string) {
    return await this.userModel.findOne({ email })
  }

  async updateOne(id: string, updateOne: UpdateOne) {
    const { username, email, newPassword, oldPassword } =
      updateOne
    const updateUser = {}

    const existedUser = await this.getOne(id)
    if (!existedUser)
      throw new ConflictException('User not found.')

    if (username) {
      const existedEmail = await this.getOneByEmail(email)
      if (existedEmail)
        throw new ConflictException('Email already exists.')
      updateUser['email'] = email
    }

    if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(
        oldPassword,
        existedUser.password
      )
      if (!isMatch)
        throw new ConflictException('Password not match.')

      const salt = await bcrypt.genSalt(10)
      const hashed = await bcrypt.hash(newPassword, salt)

      updateUser['password'] = hashed
    }

    const user = await this.userModel.findByIdAndUpdate(
      id,
      updateUser,
      { new: true }
    )

    return user
  }

  async deleteOne(id: string) {
    const existedUser = await this.getOne(id)
    if (!existedUser)
      throw new ConflictException('User not found.')

    const user = await this.userModel.findByIdAndDelete(id)
    return user
  }
}
