import { IsNumber, IsOptional, IsDateString } from 'class-validator';

export class UpdateContractDto {
  @IsOptional()
  @IsNumber()
  readonly freelancer: number;

  @IsOptional()
  @IsDateString()
  readonly startDate: Date;

  @IsOptional()
  @IsDateString()
  readonly endDate: Date;
}
