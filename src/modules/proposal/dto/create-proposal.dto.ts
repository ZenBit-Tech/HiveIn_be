import { IsNumber, IsString } from 'class-validator';

export class CreateProposalDto {
  @IsString()
  readonly coverLetter: string;

  @IsNumber()
  readonly rate: number;

  @IsNumber()
  readonly idJobPost: number;
}
