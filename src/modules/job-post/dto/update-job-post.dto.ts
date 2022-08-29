import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateJobPostDto {
  @IsString()
  readonly jobDescription: string;

  @IsNumber()
  readonly rate: number;

  @IsBoolean()
  isDraft: boolean;

  @IsNumber()
  userId: number;
}
