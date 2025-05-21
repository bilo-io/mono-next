import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import { PaginatedResponse, paginate } from '../common/pagination/paginate'; // adjust import if needed

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
  ) {}

  async create(
    name: string,
    email: string,
    password: string,
    roleIds?: string[],
  ): Promise<User> {
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password;

    if (roleIds?.length) {
      // Only set the ID (roles already exist in DB)
      user.roles = roleIds.map((id) => {
        const role = new Role();
        role.id = id;
        return role;
      });
    }

    console.log('debugging user\n\n', user);
    return this.repo.save(user);
  }

  findAll(): Promise<User[]> {
    return this.repo.find(); // roles will be included via eager loading
  }

  async findAllPaginated(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<User>> {
    const query = this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role') // include roles manually
      .orderBy('user.id', 'ASC');

    return paginate(query, page, limit);
  }

  async findById(id: number): Promise<User> {
    const user = await this.repo.findOne({ where: { id } }); // triggers eager loading
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
