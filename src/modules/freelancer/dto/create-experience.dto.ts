import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  city: string;

  @IsString()
  description: string;

  @IsString()
  employer: string;

  @IsString()
  jobTitle: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsBoolean()
  isActive: boolean;

  @IsNumber()
  freelancerId: number;
}
