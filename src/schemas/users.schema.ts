import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { ERole } from 'src/interface/users.interface'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, type: String })
  username: string

  @Prop({ required: true, type: String, unique: true })
  email: string

  @Prop({ required: true, type: String })
  password: string

  @Prop({ enum: ERole, type: String, default: ERole.USER })
  role: ERole
}

export const UserSchema = SchemaFactory.createForClass(User)
