import {
  DurationType,
  EnglishLevel,
} from 'src/modules/job-post/entities/job-post.entity';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Category } from 'src/modules/category/entities/category.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobPostDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  readonly title: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  readonly duration: number;

  @ApiProperty()
  @IsEnum(DurationType)
  readonly durationType: DurationType;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  readonly categoryId: Category;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  readonly rate: number;

  //@IsArray({ each: true })
  @ApiProperty()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  @ArrayMinSize(3)
  readonly skillsId: number[];

  @ApiProperty()
  @IsEnum(EnglishLevel)
  readonly englishLevel: EnglishLevel;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  readonly jobDescription: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  readonly userId: number;

  @ApiProperty()
  @Type(() => Boolean)
  @IsBoolean()
  readonly isDraft: boolean;

  @ApiProperty()
  @Type(() => String)
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3)
  questions?: string[];
}
