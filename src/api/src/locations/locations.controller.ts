import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { Location } from './location.entity';
import { PaginatedResponse } from '../common/pagination/paginate';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post('create')
  async create(
    @Body() createLocationDto: CreateLocationDto,
  ): Promise<Location> {
    const { name } = createLocationDto;
    return this.locationsService.create({ name });
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ): Promise<PaginatedResponse<Location>> {
    return this.locationsService.findAllPaginated(
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Location | null> {
    return this.locationsService.findById(+id); // Cast to number if `id` is numeric
  }
}
