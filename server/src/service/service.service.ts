import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService){}
  async create(data: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        duration: data.duration, // ← добавлено
      },
    });
  }

  async findAll() {
    return this.prisma.service.findMany();
  }

  async findOne(id: number) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) {
      throw new NotFoundException('Услуга не найдена');
    }
    return service;
  }

  async update(id: number, data: UpdateServiceDto) {
    return this.prisma.service.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.service.delete({ where: { id } });
  }
}
