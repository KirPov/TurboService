import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApplicationModule } from './application/application.module';
import { AuthModule } from './auth/auth.module';
import { CarsModule } from './cars/cars.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { ServiceModule } from './service/service.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    CarsModule,
    PrismaModule,
    ServiceModule,
    ApplicationModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
