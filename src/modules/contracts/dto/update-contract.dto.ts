import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsEnum, IsOptional, IsDate } from 'class-validator';
import { ContractStatus } from 'src/modules/contracts/entities/contracts.entity';
import { CreateContractDto } from './create-contract.dto';

export class UpdateContractDto extends PartialType(CreateContractDto) {
  @IsOptional()
  @IsNumber()
  readonly freelancerId: number;

  @IsOptional()
  @IsEnum(ContractStatus)
  readonly contractStatus: ContractStatus;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly endDate: Date;
}