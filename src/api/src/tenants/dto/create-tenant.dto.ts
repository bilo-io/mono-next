// src/users/dto/create-user.dto.ts
import { IsString } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  name!: string;
}
