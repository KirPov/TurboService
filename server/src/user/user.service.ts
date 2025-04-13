import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ user: User; token: string }> {
    const { email, password, role } = createUserDto;

    // Проверка существования пользователя
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    // Хеширование пароля
    const hashedPassword = await argon2.hash(password);

    // Создание пользователя с указанием роли (по умолчанию CLIENT)
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || Role.CLIENT, // Используем переданную роль или CLIENT по умолчанию
      },
    });

    // Генерация JWT токена с ролью
    const token = this.jwtService.sign({
      email: user.email,
      id: user.id,
      role: user.role,
    });

    return {
      user,
      token,
    };
  }

  async findOne(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async findAll(): Promise<Partial<User>[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true, // Добавляем роль в вывод
        // Пароль исключен
      },
    });
  }

  async updateUserRole(id: number, newRole: Role) {
    return this.prisma.user.update({
      where: { id: id }, // Передаем id пользователя для поиска
      data: { role: newRole }, // Обновляем роль
    });
  }
}
