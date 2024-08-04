import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('get/all') //Get users
  getUsers(@Query('role') roles: number) {
    return [];
  }

  @Get(':id') //Get user/:id
  getUser(@Param('id') id: string) {
    return { id };
  }

  @Post('create') //Create user
  createUser(@Body() body: {}) {
    return body;
  }

  @Patch('/update/:id') //Update
  updateUser(@Param('id') id: string, @Body() body: {}) {
    return body;
  }

  @Delete('delete') //Delete
  deleteUser(@Param('id') id: string) {
    return id;
  }
}
