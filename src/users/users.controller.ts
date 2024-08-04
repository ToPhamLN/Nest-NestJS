import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common'
import { UsersService } from './users.service'
import { ERole, TBodyRequest } from './users.interface'
import storage from 'src/config/config.multer'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('get/all') //Get users
  getUsers(@Query('role') roles: ERole) {
    return [roles]
  }

  @Post('create') //Create user
  @UseInterceptors(FileInterceptor('avatar', { storage }))
  createUser(
    @Body() body: TBodyRequest,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    console.log(files)
    return body
  }

  @Get('get/:id') //Get user/:id
  getUser(@Param('id') id: string) {
    return { id }
  }

  @Patch('/update/:id') //Update
  updateUser(@Param('id') id: string, @Body() body: TBodyRequest) {
    return { id, body }
  }

  @Delete('delete/:id') //Delete
  deleteUser(@Param('id') id: string) {
    return { id }
  }
}
