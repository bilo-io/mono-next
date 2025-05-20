import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly repo: Repository<Permission>,
  ) {}

  async create(data: Partial<Permission>): Promise<Permission> {
    const permission = this.repo.create(data);
    return await this.repo.save(permission);
  }

  async findAll(): Promise<Permission[]> {
    return await this.repo.find();
  }

  async findById(id: string): Promise<Permission | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<Permission>): Promise<Permission> {
    const permission = await this.repo.findOneOrFail({
      where: { id },
    });
    Object.assign(permission, data);
    return await this.repo.save(permission);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
