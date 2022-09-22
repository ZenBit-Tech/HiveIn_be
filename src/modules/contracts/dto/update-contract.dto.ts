import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateContractDto {
  @IsOptional()
  @IsNumber()
  readonly freelancer: number;

  @IsOptional()
  @IsBoolean()
  readonly isContractStart: boolean;

  @IsOptional()
  @IsBoolean()
  readonly isContractEnd: boolean;
}
