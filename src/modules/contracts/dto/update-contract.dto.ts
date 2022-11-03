import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateContractDto {
  @IsOptional()
  @IsBoolean()
  readonly isContractStart: boolean;

  @IsOptional()
  @IsBoolean()
  readonly isContractEnd: boolean;
}
