import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';

import { Car } from '@prisma/client';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @UsePipes(new ValidationPipe)
  create(@Body() createCarDto: CreateCarDto): Promise<Car> {
    return this.carsService.create(createCarDto); // Передаем createCarDto с обязательным ownerId
  }

  @Get()
  findAll() {
    return this.carsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(+id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carsService.remove(+id);
  }
}
