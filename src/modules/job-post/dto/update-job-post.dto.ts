import { IsNumber, IsString } from 'class-validator';

export class UpdateJobPostDto {
  @IsString()
  readonly jobDescription: string;

  @IsNumber()
  readonly rate: number;

  @IsNumber()
  userId: number;
}
