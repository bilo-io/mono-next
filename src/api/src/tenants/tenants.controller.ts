// src/tenants/tenants.controller.ts
import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { Tenant } from './tenant.entity';
import { PaginatedResponse } from '../common/pagination/paginate';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post('create')
  async create(@Body() createTenantDto: CreateTenantDto): Promise<Tenant> {
    const { name } = createTenantDto;
    return this.tenantsService.create({ name });
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ): Promise<PaginatedResponse<Tenant>> {
    return this.tenantsService.findAllPaginated(
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Tenant | null> {
    return this.tenantsService.findById(+id); // Cast to number if `id` is numeric
  }
}
