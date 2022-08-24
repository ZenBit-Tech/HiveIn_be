import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { UpdateEducationDto } from './update-education.dto';
import { UpdateExperienceDto } from './update-experience.dto';

export class CreateFreelancerDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  englishLevel: string;

  @IsString()
  position: string;

  @IsString()
  description: string;

  @IsString()
  rate: string;

  @IsNumber()
  userId: number;

  @IsNumber()
  categoryId: number;

  @IsArray()
  skillsIds: number[];

  @IsOptional()
  @IsArray()
  educations?: UpdateEducationDto[];

  @IsOptional()
  @IsArray()
  experiences?: UpdateExperienceDto[];
}
