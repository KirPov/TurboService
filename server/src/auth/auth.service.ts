import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Регистрация пользователя
  async register(email: string, password: string): Promise<{ id: number; email: string; role: Role }> {
    // Проверка существования пользователя
    const exists = await this.prisma.user.findUnique({
      where: { email }
    });

    if (exists) {
      throw new BadRequestException('Email already registered');
    }

    // Хеширование пароля
    const hashedPassword = await argon2.hash(password);

    // Создание пользователя
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: Role.CLIENT // Автоматическое назначение роли
      },
      select: {
        id: true,
        email: true,
        role: true
      }
    });

    return user;
  }

  // Логин пользователя
  async login(email: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email }
      });

      if (!user || !(await argon2.verify(user.password, password))) {
        throw new BadRequestException('Invalid credentials');
      }

      // Генерация JWT токена
      const token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        },
        token
      };
    } catch (error) {
      console.error('Login error:', error); // Логируем ошибку для диагностики
      throw new BadRequestException('Login failed');
    }
  }

  // Валидация пользователя (Метод validateUser)
  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('User not found');
    
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) throw new UnauthorizedException('Invalid password');

    return { id: user.id, email: user.email, role: user.role };
  }
}
