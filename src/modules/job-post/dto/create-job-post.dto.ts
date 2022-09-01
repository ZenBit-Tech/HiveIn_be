import {
  DurationType,
  EnglishLevel,
} from 'src/modules/job-post/entities/job-post.entity';
import {
  ArrayMinSize,
  IsBoolean,
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
  @Type(() => String)
  readonly title: string;

  @IsNumber()
  @Type(() => Number)
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
  @Type(() => Number)
  readonly rate: number;

  //@IsArray({ each: true })
  @IsNumber({}, { each: true })
  @ArrayMinSize(3)
  @ApiProperty()
  @Type(() => Number)
  readonly skillsId: number[];

  @IsEnum(EnglishLevel)
  @ApiProperty()
  readonly englishLevel: EnglishLevel;

  @IsString()
  @ApiProperty()
  @Type(() => String)
  readonly jobDescription: string;

  @IsNumber()
  @ApiProperty()
  @Type(() => Number)
  readonly userId: number;

  @IsBoolean()
  @ApiProperty()
  @Type(() => Boolean)
  readonly isDraft: boolean;
}
