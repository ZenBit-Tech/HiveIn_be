import { IsDateString, IsNumber } from 'class-validator';

export class CreateContractDto {
  @IsNumber()
  readonly freelancer: number;

  @IsDateString()
  readonly startDate: Date;

  @IsDateString()
  readonly endDate: Date;
}
