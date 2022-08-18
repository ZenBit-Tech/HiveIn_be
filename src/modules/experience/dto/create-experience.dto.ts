import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  city: string;

  @IsString()
  description: string;

  @IsString()
  employeer: string;

  @IsString()
  jobTitle: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsNumber()
  freelancerId: number;
}
