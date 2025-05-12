// src/users/users.controller.ts
import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { PaginatedResponse } from '../common/pagination/paginate';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name } = createUserDto;
    return this.usersService.create({ email, password, name });
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
    return this.usersService.findById(+id); // Cast to number if `id` is numeric
  }
}
