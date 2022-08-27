import { DurationType, EnglishLevel } from '../entities/job-post.entity';
import { Skills } from '../entities/skills.entity';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
} from 'class-validator';
import { Category } from '../entities/category.entity';
import { Type } from 'class-transformer';

export class CreateJobPostDto {
  @IsString()
  readonly title: string;

  @IsNumber()
  readonly duration: number;

  @IsEnum(DurationType)
  readonly durationType: DurationType;

  @IsInt()
  @Type(() => Number)
  readonly categoryId: Category;

  @IsNumber()
  readonly rate: number;

  @IsArray()
  @ArrayMinSize(3)
  readonly skillsId: number[];

  @IsEnum(EnglishLevel)
  readonly englishLevel: EnglishLevel;

  @IsString()
  readonly jobDescription: string;
}
