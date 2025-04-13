import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':email')
  async findOne(@Param('email', ParseIntPipe) email: string) {
    return this.userService.findOne(email);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Patch(':id/role')
  updateUserRole(
    @Param('id', ParseIntPipe) userId: number, // Валидация и преобразование id в число
    @Body() dto: UpdateUserRoleDto, // Валидация роли через DTO
  ) {
    return this.userService.updateUserRole(userId, dto.role); // Передаем в сервис
  }
}
