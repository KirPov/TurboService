import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { NotificationGateway } from '../notification/notification.gateway';
import { WorkStatus } from '@prisma/client';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async findAll() {
    return this.prisma.application.findMany({
      include: {
        services: true,
        user: true,
        car: true,
        assignedEmployee: true, // 🔥 добавь это!
      },
    });
  }
  

  async isSlotAvailable(startDate: Date, endDate: Date): Promise<boolean> {
    const applications = await this.prisma.application.findMany({
      where: {
        status: 'approved', // ✅ теперь учитываются только подтверждённые заявки
        OR: [
          { startDate: { gte: startDate, lt: endDate } },
          { endDate: { gt: startDate, lte: endDate } },
          { startDate: { lte: startDate }, endDate: { gte: endDate } }, // перекрытие всего периода
        ],
      },
    });

    return applications.length === 0;
  }

  async create(dto: CreateApplicationDto) {
    const {
      userId,
      carBrand,
      carModel,
      year,
      description,
      serviceIds,
      date,
      rememberCar,
    } = dto;
  
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
  
    // Учитываем не только марку и модель, но и год
    let car = await this.prisma.car.findFirst({
      where: {
        brand: carBrand,
        model: carModel,
        year: year ?? new Date().getFullYear(), // ✅ учитываем год
        ownerId: userId,
        isDeleted: false, // 💡 на всякий случай
      },
    });
  
    // Если авто с такими параметрами не найдено — создаём
    if (!car) {
      car = await this.prisma.car.create({
        data: {
          brand: carBrand,
          model: carModel,
          year: year ?? new Date().getFullYear(),
          ownerId: userId,
          remembered: rememberCar ?? false, // ✅ сохраняем только если флаг true
        },
      });
    }
  
    // Проверка услуг
    const services = await this.prisma.service.findMany({
      where: { id: { in: serviceIds } },
    });
  
    if (services.length !== serviceIds.length) {
      throw new NotFoundException('Некоторые услуги не найдены');
    }
  
    const totalDuration = services.reduce((sum, s) => sum + (s.duration || 0), 0);
    const startDate = new Date(date);
    const endDate = new Date(startDate.getTime() + totalDuration * 60 * 1000);
  
    // Проверка слота
    const isAvailable = await this.isSlotAvailable(startDate, endDate);
    if (!isAvailable) {
      throw new BadRequestException('Выбранное время уже занято');
    }
  
    const application = await this.prisma.application.create({
      data: {
        userId,
        carId: car.id,
        description,
        status: 'pending',
        startDate,
        endDate,
        services: {
          connect: serviceIds.map((id) => ({ id })),
        },
      },
      include: {
        services: true,
        user: true,
        car: true,
      },
    });
  
    await this.notificationGateway.sendApplicationStatusUpdate(
      application.id,
      application.status,
    );
  
    return application;
  }
  

  async updateStatus(id: number, status: string, employeeId?: number) {
    const validManagerStatuses = ['pending', 'approved', 'rejected'];
    const validWorkStatuses = ['WAITING', 'IN_PROGRESS', 'CHECK', 'READY'];
  
    const application = await this.prisma.application.findUnique({
      where: { id },
    });
  
    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }
  
    // Менеджер обновляет основной статус и назначает сотрудника
    if (validManagerStatuses.includes(status)) {
      const updated = await this.prisma.application.update({
        where: { id },
        data: {
          status,
          assignedEmployeeId: employeeId ?? undefined,
        },
        include: {
          services: true,
          user: true,
          car: true,
        },
      });
  
      await this.notificationGateway.sendApplicationStatusUpdate(
        updated.id,
        updated.status,
      );
  
      return updated;
    }
  
    // Сотрудник обновляет только рабочий статус
    if (validWorkStatuses.includes(status)) {
      return this.prisma.application.update({
        where: { id },
        data: {
          workStatus: status as WorkStatus,
        },
      });
    }
    
  
    throw new BadRequestException('Invalid status provided');
  }
  
  

  async assignEmployee(applicationId: number, employeeId: number) {
    const employee = await this.prisma.user.findFirst({
      where: {
        id: employeeId,
        role: 'SERVICE_EMPLOYEE',
      },
    });
  
    if (!employee) {
      throw new NotFoundException('Сотрудник не найден или не является сервисным мастером');
    }
  
    const application = await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        assignedEmployeeId: employeeId,
      },
      include: {
        user: true,
        car: true,
        services: true,
      },
    });
  
    return application;
  }
  
  async updateWorkStatus(applicationId: number, workStatus: 'WAITING' | 'IN_PROGRESS' | 'CHECK' | 'READY') {
    return this.prisma.application.update({
      where: { id: applicationId },
      data: { workStatus },
    });
  }

  async getApplicationsForEmployee(employeeId: number) {
    return this.prisma.application.findMany({
      where: { assignedEmployeeId: employeeId },
      include: {
        user: true,
        car: true,
        services: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    });
    
  }

  async getByEmployee(employeeId: number) {
  return this.prisma.application.findMany({
    where: {
      assignedEmployeeId: employeeId,
    },
    include: {
      car: true,
      services: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}


  
}
