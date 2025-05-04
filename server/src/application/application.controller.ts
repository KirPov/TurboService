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
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; employeeId?: number }
  ) {
    const applicationId = parseInt(id, 10);
  
    const { status, employeeId } = body;
  
    return this.applicationService.updateStatus(applicationId, status, employeeId);
  }
  

  @Patch(':id/assign/:employeeId')
assignEmployee(
  @Param('id') id: string,
  @Param('employeeId') employeeId: string,
) {
  return this.applicationService.assignEmployee(+id, +employeeId);
}

@Patch(':id/work-status')
updateWorkStatus(
  @Param('id') id: string,
  @Body('workStatus') workStatus: 'WAITING' | 'IN_PROGRESS' | 'CHECK' | 'READY',
) {
  return this.applicationService.updateWorkStatus(+id, workStatus);
}

@Get('assigned/:employeeId')
getApplicationsForEmployee(@Param('employeeId') id: string) {
  return this.applicationService.getApplicationsForEmployee(+id);
}

@Get('employee/:id')
getByEmployee(@Param('id') id: string) {
  return this.applicationService.getByEmployee(+id);
}



  
}
