import { IsDate, IsEnum, IsNumber } from 'class-validator';
import { ContractStatus } from 'src/modules/contracts/entities/contracts.entity';

export class CreateContractDto {
  @IsNumber()
  readonly freelancerId: number;

  @IsEnum(ContractStatus)
  readonly contractStatus: ContractStatus;

  @IsDate()
  readonly endDate: Date;
}
