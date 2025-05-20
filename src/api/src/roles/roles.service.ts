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

    if (permissionIds?.length) {
      const permissions = permissionIds.map((id) => {
        const p = new Permission();
        p.id = id;
        return p;
      });

      role.permissions = permissions;

      console.log('permissions', permissions);
      console.log('role.permissions', role);
    }

    if (parentId) {
      const parent = await this.roleRepo.findOne({ where: { id: parentId } });
      // @ts-expect-error undefined is not a valid type for Role | null (but we're removing it here, as the topmost node has no tree)
      role.parent = parent ?? undefined;
    }

    const saved = await this.roleRepo.save(role);

    // ✅ Use tree traversal to return role with level populated
    const tree = await this.roleRepo.findAncestorsTree(saved);
    return this.findNodeInTree(tree, saved.id);
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

  private findNodeInTree(tree: Role, id: string): Role {
    if (tree.id === id) return tree;
    for (const child of tree.children || []) {
      const result = this.findNodeInTree(child, id);
      if (result) return result;
    }
    throw new Error(`Role with id ${id} not found in tree`);
  }

  async getRoleWithLevel(id: string): Promise<Role> {
    const role = await this.roleRepo.findOne({ where: { id } });
    const tree = await this.roleRepo.findAncestorsTree(role!);
    return this.findNodeInTree(tree, id);
  }
}
