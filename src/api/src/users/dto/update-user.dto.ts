// import { PartialType } from '@nestjs/mapped-types';
// import { CreateUserDto } from './create-user.dto';

// export class UpdateUserDto extends PartialType(CreateUserDto) {}

import { IsEmail, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  email?: string;
  // NB: usually updating emails would involve a lot more, and is often not permitted,
  // although the user is actually identified by their ID

  @IsString()
  @MinLength(6)
  password?: string;

  @IsString()
  name?: string;
}
