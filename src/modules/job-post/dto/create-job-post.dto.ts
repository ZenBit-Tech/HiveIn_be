import { DurationType, EnglishLevel } from '../entities/job-post.entity';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Category } from '../../category/entities/category.entity';

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

  @IsNumber()
  userId: number;
}
