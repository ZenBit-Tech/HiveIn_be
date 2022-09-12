import { IsNumber, IsString } from 'class-validator';

export class CreateProposalDto {
  @IsString()
  readonly coverLetter: string;

  @IsNumber()
  readonly bid: number;

  @IsNumber()
  readonly idJobPost: number;
}
