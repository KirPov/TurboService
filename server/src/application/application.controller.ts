import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  // Получение всех заявок
  @Get()
  async findAll() {
    return this.applicationService.findAll();
  }

  // Создание новой заявки
  @Post()
  async create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationService.create(createApplicationDto); // Используем метод create
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const applicationId = parseInt(id, 10); // Преобразуем строку в число
    console.log(
      `Updating status for application ID: ${applicationId} to ${status}`,
    );

    try {
      // Проверяем параметры
      if (!applicationId || isNaN(applicationId)) {
        console.log('Invalid id');
        throw new Error('Invalid ID');
      }

      const result = await this.applicationService.updateStatus(
        applicationId,
        status,
      );
      console.log('Status updated successfully:', result);

      return result;
    } catch (error) {
      console.error('Error updating status:', error);
      throw new Error(`Failed to update status: ${error.message}`);
    }
  }
}
