import { IsNumber, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ContractStatus } from 'src/modules/contracts/entities/contracts.entity';

export class UpdateContractDto {
  @IsOptional()
  @IsNumber()
  readonly freelancerId: number;

  @IsOptional()
  @IsEnum(ContractStatus)
  readonly contractStatus: ContractStatus;

  @IsOptional()
  @IsDateString()
  readonly startDate: Date;

  @IsOptional()
  @IsDateString()
  readonly endDate: Date;
}
