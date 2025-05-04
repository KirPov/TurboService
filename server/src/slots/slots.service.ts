import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { addDays, format } from 'date-fns';

@Injectable()
export class SlotService {
  constructor(private readonly prisma: PrismaService) {}


  async getOccupiedSlots(date: string) {
    const dayStart = new Date(`${date}T09:00:00`);
    const dayEnd = new Date(`${date}T17:00:00`);

    const applications = await this.prisma.application.findMany({
      where: {
        startDate: { gte: dayStart },
        endDate: { lte: dayEnd },
      },
      select: {
        startDate: true,
        endDate: true,
      },
    });

    return applications.map((a) => ({
      startTime: a.startDate.toISOString(),
      endTime: a.endDate.toISOString(),
    }));
  }
  
  async getFullyBookedDates(): Promise<string[]> {
    const fullyBooked: string[] = [];
    const workingMinutesPerDay = 8 * 60; // 09:00 – 17:00
    const daysToCheck = 30;

    for (let i = 0; i < daysToCheck; i++) {
      const date = addDays(new Date(), i);
      const dateString = format(date, 'yyyy-MM-dd');
      const dayStart = new Date(`${dateString}T09:00:00`);
      const dayEnd = new Date(`${dateString}T17:00:00`);

      const appointments = await this.prisma.application.findMany({
        where: {
          startDate: { gte: dayStart },
          endDate: { lte: dayEnd },
          status: { not: 'rejected' }, // ❗ исключаем отклонённые
        },
        select: {
          startDate: true,
          endDate: true,
        },
      });

      const totalUsedMinutes = appointments.reduce((sum, app) => {
        const start = new Date(app.startDate).getTime();
        const end = new Date(app.endDate).getTime();
        const duration = (end - start) / 1000 / 60;
        return sum + duration;
      }, 0);

      if (totalUsedMinutes >= workingMinutesPerDay) {
        fullyBooked.push(dateString);
      }
    }

    return fullyBooked;
  }

  async getAvailableSlots(date: string, duration: number) {
    const dayStart = new Date(`${date}T09:00:00`);
    const dayEnd = new Date(`${date}T17:00:00`);
    const interval = 15;
  
    // ⛔ Учитываем только approved заявки (pending больше не блокируют)
    const appointments = await this.prisma.application.findMany({
      where: {
        startDate: { lt: dayEnd },
        endDate: { gt: dayStart },
        status: 'approved', // ✅ только подтверждённые
      },
      select: {
        startDate: true,
        endDate: true,
      },
    });
  
    const slots: { startTime: string; endTime: string; isAvailable: boolean }[] = [];
    let current = new Date(dayStart);
  
    while (current.getTime() + duration * 60 * 1000 <= dayEnd.getTime()) {
      const potentialStart = new Date(current);
      const potentialEnd = new Date(current.getTime() + duration * 60 * 1000);
  
      const overlaps = appointments.some(({ startDate, endDate }) => {
        return potentialStart < endDate && potentialEnd > startDate;
      });
  
      slots.push({
        startTime: potentialStart.toISOString(),
        endTime: potentialEnd.toISOString(),
        isAvailable: !overlaps,
      });
  
      current = new Date(current.getTime() + interval * 60 * 1000);
    }
  
    return slots;
  }
}
