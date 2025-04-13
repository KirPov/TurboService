import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { NotificationGateway } from '../notification/notification.gateway'; // Импортируем NotificationGateway

@Injectable()
export class ApplicationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationGateway: NotificationGateway, // Внедряем NotificationGateway
  ) {}

  // Получение всех заявок
  async findAll() {
    return this.prisma.application.findMany({
      include: {
        services: true,
        user: true,
        car: true,
      },
    });
  }

  // Создание новой заявки
  async create(dto: CreateApplicationDto) {
    const { userId, carBrand, carModel, description, serviceIds } = dto;

    // Проверяем, существует ли пользователь
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Проверяем, существует ли автомобиль с такой маркой и моделью
    let car = await this.prisma.car.findFirst({
      where: {
        brand: carBrand,
        model: carModel,
      },
    });

    // Если автомобиль не найден, создаем новый
    if (!car) {
      car = await this.prisma.car.create({
        data: {
          brand: carBrand,
          model: carModel,
          year: new Date().getFullYear(), // можно указать год создания или предложить клиенту добавить
          ownerId: userId, // Привязываем автомобиль к пользователю
        },
      });
    }

    // Получаем услуги
    const services = await this.prisma.service.findMany({
      where: { id: { in: serviceIds } },
    });

    if (services.length !== serviceIds.length) {
      throw new NotFoundException('Some services were not found');
    }

    // Создаем заявку
    const application = await this.prisma.application.create({
      data: {
        userId,
        carId: car.id, // Привязываем найденный или созданный автомобиль к заявке
        description,
        status: 'pending', // Статус по умолчанию: ожидает подтверждения
        services: {
          connect: serviceIds.map((id) => ({ id })), // Привязываем услуги
        },
      },
      include: {
        services: true,
        user: true,
        car: true,
      },
    });

    // Отправляем уведомление о статусе заявки через WebSocket
    this.notificationGateway.sendApplicationStatusUpdate(application.id, application.status);

    return application;
  }

  // Обновление статуса заявки
  async updateStatus(id: number, status: string) {
    console.log(`Attempting to update status for application ID: ${id} to ${status}`);
  
    // Проверка на допустимые статусы
    const validStatuses = ['pending', 'approved', 'rejected']; // Список допустимых статусов
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid status');
    }
  
    const application = await this.prisma.application.findUnique({
      where: { id },
    });
  
    if (!application) {
      console.error(`Application with ID ${id} not found`);
      throw new NotFoundException(`Application with ID ${id} not found`);
    }
  
    console.log(`Found application: ${application.id} - Updating status to: ${status}`);
  
    // Обновляем статус заявки
    const updatedApplication = await this.prisma.application.update({
      where: { id },
      data: { status },
      include: {
        services: true,
        user: true,
        car: true,
      },
    });
  
    // Отправляем уведомление о статусе заявки через WebSocket
    this.notificationGateway.sendApplicationStatusUpdate(updatedApplication.id, updatedApplication.status);
  
    return updatedApplication;
  }
}
