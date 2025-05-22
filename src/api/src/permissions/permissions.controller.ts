import { Permission } from './permission.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionService: PermissionsService) {}

  @Post()
  create(@Body() body: { name: string }) {
    return this.permissionService.create({ name: body.name });
  }

  @Get()
  findAll(): Promise<Permission[]> {
    return this.permissionService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Permission | null> {
    return this.permissionService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdatePermissionDto,
  ): Promise<Permission> {
    return this.permissionService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.permissionService.remove(id);
    return { message: `Permission with ID ${id} has been deleted` };
  }
}
