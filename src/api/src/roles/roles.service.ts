// role.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Permission } from '../permissions/permission.entity';
import { Repository, TreeRepository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: TreeRepository<Role>,

    @InjectRepository(Role)
    private readonly treeRepo: TreeRepository<Role>,

    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  findAll(): Promise<Role[]> {
    return this.roleRepo.find();
  }

  async createRole(name: string, parentId?: string): Promise<Role> {
    const role = this.roleRepo.create({ name });

    if (parentId) {
      const parent = await this.roleRepo.findOne({ where: { id: parentId } });
      role.parent = parent as Role;
    }

    return this.roleRepo.save(role);
  }

  async assignPermission(roleId: string, permissionNames: string[]) {
    const role = await this.roleRepo.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    const permissions = await this.permissionRepo.findByIds(permissionNames);

    role!.permissions = [...(role!.permissions || []), ...permissions];

    return this.roleRepo.save(role!);
  }

  async getDescendantRoles(roleId: string): Promise<Role[]> {
    const role = await this.roleRepo.findOne({ where: { id: roleId } });
    return this.roleRepo.findDescendants(role!);
  }

  async getAncestorRoles(roleId: string): Promise<Role[]> {
    const role = await this.roleRepo.findOne({ where: { id: roleId } });
    return this.roleRepo.findAncestors(role!);
  }
}
