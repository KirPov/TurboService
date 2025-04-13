import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Регистрация
  @Post('register') // Путь на регистрацию
  async register(
    @Body('email') email: string,
    @Body('password') password: string
  ) {
    return this.authService.register(email, password);
  }

  // Логин
  @Post('login') // Путь на логин
  async login(
    @Body('email') email: string,
    @Body('password') password: string
  ) {
    return this.authService.login(email, password);
  }

  // Валидация пользователя (добавим этот метод для использования)
  @Post('validateUser') // Путь для валидации пользователя
  async validateUser(
    @Body('email') email: string,
    @Body('password') password: string
  ) {
    return this.authService.validateUser(email, password);
  }
}
