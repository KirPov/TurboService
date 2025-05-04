import { Module } from '@nestjs/common';
import { SlotController } from './slots.controller';
import { SlotService } from './slots.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SlotController],
  providers: [SlotService],
})
export class SlotModule {}
