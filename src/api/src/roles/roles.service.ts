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

  async createRole(
    name: string,
    parentId?: string,
    permissionIds?: string[],
  ): Promise<Role> {
    const role = new Role();
    role.name = name;

    // Optional: assign permissions if provided
    if (permissionIds?.length) {
      role.permissions = permissionIds.map((id) => {
        const perm = new Permission();
        perm.id = id;
        return perm;
      });
    }

    if (parentId) {
      const parent = await this.roleRepo.findOne({
        where: { id: parentId },
        relations: ['parent'],
      });
      if (!parent) {
        throw new Error(`Parent role with id ${parentId} not found`);
      }
      role.parent = parent;
      // role.level = parent.level + 1;
      await this.roleRepo.save(role);
    } else {
      // role.level = 0;
    }

    // ✅ Let TreeRepository handle the level
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

  async update(id: string, data: Partial<Role>): Promise<Role> {
    const role = await this.roleRepo.findOneOrFail({
      where: { id },
    });
    Object.assign(role, data);
    return await this.roleRepo.save(role);
  }

  async remove(id: string): Promise<void> {
    await this.roleRepo.delete(id);
  }
}
