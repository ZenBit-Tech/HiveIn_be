import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProposalDto {
  @IsNotEmpty()
  @IsString()
  readonly message: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly bid: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  readonly idJobPost: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  readonly idFreelancer: number;
}
