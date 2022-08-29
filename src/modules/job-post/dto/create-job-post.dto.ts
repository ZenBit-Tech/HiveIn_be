import {
  DurationType,
  EnglishLevel,
} from 'src/modules/job-post/entities/job-post.entity';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Category } from 'src/modules/category/entities/category.entity';

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

  @IsBoolean()
  isDraft: boolean;
}
