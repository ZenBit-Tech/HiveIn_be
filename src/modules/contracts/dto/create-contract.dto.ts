import { IsDateString, IsEnum, IsNumber } from 'class-validator';
import { ContractStatus } from 'src/modules/contracts/entities/contracts.entity';

export class CreateContractDto {
  @IsNumber()
  readonly freelancer: number;

  @IsEnum(ContractStatus)
  readonly contractStatus: ContractStatus;

  @IsDateString()
  readonly startDate: Date;

  @IsDateString()
  readonly endDate: Date;
}
