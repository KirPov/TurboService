import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationDto } from './create-application.dto';
import { IsIn } from 'class-validator';

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
    @IsIn(['pending', 'in_progress', 'completed'], {
        message: 'Статус должен быть одним из: pending, in_progress, completed',
      })
    status: string;
    description?: string; // Новое описание заявки

    serviceIds?: number[]; // Новый список ID услуг
}
