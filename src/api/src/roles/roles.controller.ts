import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './role.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Post()
  create(@Body() body: { name: string; parentId?: string }) {
    return this.roleService.createRole(body.name, body.parentId);
  }

  @Get()
  findAll(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  @Post(':id/permissions')
  assignPermissions(
    @Param('id') id: string,
    @Body() body: { permissions: string[] },
  ) {
    return this.roleService.assignPermission(id, body.permissions);
  }

  @Get(':id/ancestors')
  getAncestors(@Param('id') id: string) {
    return this.roleService.getAncestorRoles(id);
  }

  @Get(':id/descendants')
  getDescendants(@Param('id') id: string) {
    return this.roleService.getDescendantRoles(id);
  }
}
