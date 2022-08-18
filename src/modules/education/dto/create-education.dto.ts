import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateEducationDto {
  @IsString()
  city: string;

  @IsString()
  description: string;

  @IsString()
  degree: string;

  @IsString()
  school: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsNumber()
  freelancerId: number;
}
