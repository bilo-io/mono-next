import {
  IsString,
  IsOptional,
  IsUUID,
  IsArray,
  IsInt,
  Min,
} from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name!: string;

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
