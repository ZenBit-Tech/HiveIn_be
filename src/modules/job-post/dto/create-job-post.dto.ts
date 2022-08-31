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
import { Category } from 'src/modules/category/entities/category.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobPostDto {
  @IsString()
  @ApiProperty()
  readonly title: string;

  @IsNumber()
  @ApiProperty()
  readonly duration: number;

  @IsEnum(DurationType)
  @ApiProperty()
  readonly durationType: DurationType;

  @IsInt()
  @ApiProperty()
  @Type(() => Number)
  readonly categoryId: Category;

  @IsNumber()
  @ApiProperty()
  readonly rate: number;

  @IsArray()
  @ArrayMinSize(3)
  @ApiProperty()
  readonly skillsId: number[];

  @IsEnum(EnglishLevel)
  @ApiProperty()
  readonly englishLevel: EnglishLevel;

  @IsString()
  @ApiProperty()
  readonly jobDescription: string;

  @IsNumber()
  @ApiProperty()
  userId: number;
}
