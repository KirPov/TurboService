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
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('employees')
  getServiceEmployees() {
    return this.userService.getServiceEmployees();
  }

  // 🔁 Получение по ID
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id); // 👇 нужно создать метод
  }

  // 📧 Получение по email — через другой маршрут
  @Get('by-email/:email')
  findOneByEmail(@Param('email') email: string) {
    return this.userService.findOne(email);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Patch(':id/role')
  updateUserRole(
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.userService.updateUserRole(userId, dto.role);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }



}

