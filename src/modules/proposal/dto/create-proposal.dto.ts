import { IsNumber, IsString } from 'class-validator';

export class CreateProposalDto {
  @IsString()
  readonly message: string;

  @IsNumber()
  readonly bid: number;

  @IsNumber()
  readonly idJobPost: number;

  @IsNumber()
  readonly idFreelancer: number;
}
