import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  // UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import {
  FileFieldsInterceptor,
  FilesInterceptor
  // FileInterceptor
} from '@nestjs/platform-express'
import { UsersService } from './users.service'
import { ERole, TBodyRequest, TMultipleFiles } from '../interface/users.interface'
import storage from 'src/config/config.multer'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('get/all') //Get users
  getUsers(@Query('role') roles: ERole) {
    return [roles]
  }

  @Post('create') //Create user
  @UseInterceptors(FilesInterceptor('avatar', 5, { storage }))
  createUser(
    @Body() body: TBodyRequest,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    return this.usersService.createUser(body, files)
  }

  @Get('get/:id') //Get user/:id
  getUser(@Param('id') id: string) {
    return { id }
  }

  @Patch('/update/:id') //Update user
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'avatar', maxCount: 5 },
        { name: 'background', maxCount: 5 }
      ],
      { storage }
    )
  )
  updateUser(
    @Param('id') id: string,
    @Body() body: TBodyRequest,
    @UploadedFiles() files: TMultipleFiles
  ) {
    return this.usersService.updateUser(id, body, files)
  }

  @Delete('delete/:id') //Delete user
  deleteUser(@Param('id') id: string) {
    return { id }
  }
}
