// src/users/dto/create-user.dto.ts
import { IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  name!: string;
}
