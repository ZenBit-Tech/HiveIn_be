import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  DurationType,
  EnglishLevel,
} from 'src/modules/job-post/entities/job-post.entity';
import { Category } from 'src/modules/category/entities/category.entity';

export class CreateJobDraftDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  readonly title: string;

  @ApiProperty()
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  readonly duration?: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(DurationType)
  readonly durationType?: DurationType;

  @ApiProperty()
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  readonly categoryId?: Category;

  @ApiProperty()
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  readonly rate?: number;

  @ApiProperty()
  @Type(() => Number)
  @IsOptional()
  @IsNumber({}, { each: true })
  @ArrayMinSize(3)
  readonly skillsId?: number[];

  @ApiProperty()
  @IsEnum(EnglishLevel)
  @IsOptional()
  readonly englishLevel?: EnglishLevel;

  @ApiProperty()
  @Type(() => String)
  @IsOptional()
  @IsString()
  readonly jobDescription?: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  readonly userId: number;

  @ApiProperty()
  @Type(() => Boolean)
  @IsBoolean()
  readonly isDraft: boolean;
}
