import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { UpdateEducationDto } from './update-education.dto';
import { UpdateExperienceDto } from './update-experience.dto';
import { Users } from '../../entities/users.entity';

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

  @IsObject()
  user: Users;

  @IsOptional()
  @IsArray()
  educations?: UpdateEducationDto[];

  @IsOptional()
  @IsArray()
  experiences?: UpdateExperienceDto[];
}
