import { Module } from '@nestjs/common';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';

@Module({
  controllers: [ApplicationController],
  providers: [ApplicationService, PrismaService, NotificationGateway],
})
export class ApplicationModule {}
