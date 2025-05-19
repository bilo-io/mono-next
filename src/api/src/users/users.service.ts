import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { paginate, PaginatedResponse } from '../common/pagination/paginate';
import { Role } from '../roles/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
  ) {}

  create(data: Partial<User>): Promise<User> {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  findAll(): Promise<User[]> {
    return this.repo.find();
  }

  findAllPaginated(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<User>> {
    const query = this.repo
      .createQueryBuilder('user')
      .orderBy('user.id', 'ASC');
    return paginate(query, page, limit);
  }

  async findById(id: number): Promise<User> {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, attrs: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    await this.repo.remove(user);
  }
}
