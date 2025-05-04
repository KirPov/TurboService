import { Controller, Get, Query } from '@nestjs/common';
import { SlotService } from './slots.service';

@Controller()
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @Get('available-slots')
  getAvailableSlots(@Query('date') date: string, @Query('duration') duration: number) {
    return this.slotService.getAvailableSlots(date, duration);
  }

  @Get('occupied-slots')
  getOccupiedSlots(@Query('date') date: string) {
    return this.slotService.getOccupiedSlots(date);
  }

  @Get('fully-booked-dates')
  getFullyBookedDates() {
    return this.slotService.getFullyBookedDates();
  }
}
