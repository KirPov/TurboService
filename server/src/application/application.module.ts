import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationGateway } from 'src/notification/notification.gateway';



@Module({
  imports: [PrismaModule],
  controllers: [ApplicationController],
  providers: [ApplicationService, NotificationGateway],
})
export class ApplicationModule {}
