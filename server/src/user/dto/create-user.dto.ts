import { Role } from '@prisma/client'; // Импортируем тип Role из Prisma
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'The password must be longer than 6 characters.' })
  password: string;

  @IsOptional()
  @IsEnum(Role, {
    message: `Role must be one of: ${Object.values(Role).join(', ')}`,
  })
  role?: Role; // Опциональное поле с валидацией
}
