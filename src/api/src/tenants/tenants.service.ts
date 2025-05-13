import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './tenant.entity';
import { Repository } from 'typeorm';
import { paginate, PaginatedResponse } from '../common/pagination/paginate';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant) private readonly repo: Repository<Tenant>,
  ) {}

  create(data: Partial<Tenant>): Promise<Tenant> {
    const tenant = this.repo.create(data);
    return this.repo.save(tenant);
  }

  findAll(): Promise<Tenant[]> {
    return this.repo.find();
  }

  findAllPaginated(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<Tenant>> {
    const query = this.repo
      .createQueryBuilder('tenant')
      .orderBy('tenant.createdAt', 'ASC');
    return paginate(query, page, limit);
  }

  async findById(id: number): Promise<Tenant> {
    const tenant = await this.repo.findOneBy({ id });
    if (!tenant) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return tenant;
  }
}
