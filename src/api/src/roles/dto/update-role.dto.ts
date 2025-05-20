import {
  IsOptional,
  IsString,
  IsUUID,
  IsArray,
  IsInt,
  Min,
} from 'class-validator';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  permissionIds?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  level?: number;
}
