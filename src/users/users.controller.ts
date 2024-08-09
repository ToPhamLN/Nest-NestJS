import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards
} from '@nestjs/common'
import { UsersService } from './users.service'
import { LoggerService } from 'src/logger/logger.service'
import { ListAllQuery, UpdateOne } from './dto'
import { RolesGuard } from 'src/guards/role.guard'
import { JwtAuthGuard } from 'src/guards/jwt.guard'
// import { Roles } from 'src/decorators/roles.decorator'

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: LoggerService
  ) {}

  @Get('/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAll(@Query() query: ListAllQuery) {
    try {
      return await this.usersService.getAll(query)
    } catch (error) {
      throw error
    }
  }

  @Get('/:id')
  async getOne(@Param('id') id: string) {
    try {
      return await this.usersService.getOne(id)
    } catch (error) {
      throw error
    }
  }

  @Patch('/:id')
  async updateOne(
    @Param('id') id: string,
    @Query() query: UpdateOne
  ) {
    try {
      const user = await this.usersService.updateOne(id, query)
      return {
        user,
        message: 'Update successfully'
      }
    } catch (error) {
      throw error
    }
  }

  @Delete('/:id')
  async deleteOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.deleteOne(id)
      return {
        message: 'Delete successfully',
        user
      }
    } catch (error) {
      throw error
    }
  }
}
