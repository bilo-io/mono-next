import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './role.entity';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Post('create')
  create(
    @Body() body: { name: string; parentId?: string; permissionIds?: string[] },
  ) {
    return this.roleService.createRole(
      body.name,
      body.parentId,
      body.permissionIds,
    );
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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.roleService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.roleService.remove(id);
    return { message: `Role with ID ${id} has been deleted` };
  }
}
