// import { PartialType } from '@nestjs/mapped-types';
// import { CreateUserDto } from './create-user.dto';

// export class UpdateUserDto extends PartialType(CreateUserDto) {}

import { IsEmail, IsString } from 'class-validator';

export class UpdatePermissionDto {
  @IsEmail()
  email?: string;
  // NB: usually updating emails would involve a lot more, and is often not permitted,
  // although the user is actually identified by their ID

  @IsString()
  name?: string;
}
