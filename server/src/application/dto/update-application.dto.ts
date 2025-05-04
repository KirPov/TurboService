import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationDto } from './create-application.dto';
import { IsOptional, IsIn } from 'class-validator';

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
  @IsOptional()
  @IsIn(['pending', 'approved', 'rejected', 'WAITING', 'IN_PROGRESS', 'CHECK', 'READY'], {
    message:
      'Статус должен быть одним из: pending, approved, rejected, WAITING, IN_PROGRESS, CHECK, READY',
  })
  status?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  serviceIds?: number[];

  @IsOptional()
  assignedEmployeeId?: number;
}
