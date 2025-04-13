import { Role } from '@prisma/client';
import { IsEnum, IsInt } from 'class-validator';

export class UpdateUserRoleDto {
  @IsInt()
  id: number;

  @IsEnum(Role, { message: 'Недопустимая роль' })
  role: Role;
}
