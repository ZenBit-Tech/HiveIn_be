import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateEducationDto } from 'src/modules/education/dto/create-education.dto';
import { CreateExperienceDto } from 'src/modules/experience/dto/create-experience.dto';

export class CreateFreelancerDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  englishLevel: string;

  @IsString()
  position: string;

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
  educations: CreateEducationDto[];

  @IsOptional()
  @IsArray()
  experiences: CreateExperienceDto[];
}
