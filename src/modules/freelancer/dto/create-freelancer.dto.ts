import {
  IsArray,
  IsNumber,
  IsObject,
  isObject,
  IsString,
} from 'class-validator';
import { CreateEducationDto } from 'src/modules/education/dto/create-education.dto';
import { CreateExperienceDto } from 'src/modules/experience/dto/create-experience.dto';

export class CreateFreelancerDto {
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

  @IsObject()
  @IsArray()
  educations: CreateEducationDto[];

  @IsObject()
  @IsArray()
  experiences: CreateExperienceDto[];
}
