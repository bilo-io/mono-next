import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './location.entity';
import { Repository } from 'typeorm';
import { paginate, PaginatedResponse } from '../common/pagination/paginate';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location) private readonly repo: Repository<Location>,
  ) {}

  create(data: Partial<Location>): Promise<Location> {
    const location = this.repo.create(data);
    return this.repo.save(location);
  }

  findAll(): Promise<Location[]> {
    return this.repo.find();
  }

  findAllPaginated(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<Location>> {
    const query = this.repo
      .createQueryBuilder('location')
      .orderBy('location.id', 'ASC');
    return paginate(query, page, limit);
  }

  async findById(id: number): Promise<Location> {
    const location = await this.repo.findOneBy({ id });
    if (!location) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return location;
  }
}
