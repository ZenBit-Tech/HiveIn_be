import { DurationType, EnglishLevel } from '../entities/job-post.entity';
import { Skills } from '../entities/skills.entity';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateJobPostDto {
  @IsString()
  readonly title: string;

  @IsNumber()
  readonly duration: number;

  @IsEnum(DurationType)
  readonly durationType: DurationType;

  @IsString()
  readonly categoryId: number;

  @IsNumber()
  readonly rate: number;

  @IsArray()
  readonly skills: Skills[];

  @IsEnum(EnglishLevel)
  readonly englishLevel: EnglishLevel;

  @IsString()
  readonly jobDescription: string;
}
