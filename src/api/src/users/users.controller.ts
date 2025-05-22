import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { PaginatedResponse } from '../common/pagination/paginate';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name, roleIds } = createUserDto;
    return this.usersService.create(name, email, password, roleIds);
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ): Promise<PaginatedResponse<User>> {
    return this.usersService.findAllPaginated(parseInt(page), parseInt(limit));
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findById(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.usersService.remove(+id);
    return { message: `User with ID ${id} has been deleted` };
  }
}
