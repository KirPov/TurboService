import { Injectable } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Car, Prisma } from '@prisma/client';


@Injectable()
export class CarsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCarDto): Promise<Car> {
    return this.prisma.car.create({
      data: {
        brand: data.brand,
        model: data.model,
        year: data.year,
        owner: {
          connect: { id: data.ownerId },  // Здесь мы связываем машину с пользователем через ownerId
        },
      },
    });
  }
  
  async findAll(): Promise<Car[]> {
    return this.prisma.car.findMany();
  }

  async findOne(id: number): Promise<Car | null> {
    return this.prisma.car.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Prisma.CarUpdateInput): Promise<Car> {
    return this.prisma.car.update({
      where: { id },
      data,
    });
  }


  async getRememberedCars(userId: number) {
    return this.prisma.car.findMany({
      where: {
        ownerId: userId,
        remembered: true,
        isDeleted: false, // ✅ фильтрация
      },
    });
  }
  
  
  async remove(id: number): Promise<Car> {
    return this.prisma.car.update({
      where: { id },
      data: { isDeleted: true }, // ✅ мягкое удаление
    });
  }
  
  
}
