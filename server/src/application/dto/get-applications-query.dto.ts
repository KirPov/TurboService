import { IsOptional, IsIn, IsNumber, IsString } from 'class-validator';

export class GetApplicationsQueryDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  offset?: number;
}