import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  DurationType,
  EnglishLevel,
} from 'src/modules/job-post/entities/job-post.entity';
import { Type } from 'class-transformer';

export class searchJobFiltersDto {
  @IsOptional()
  @Type(() => Number)
  take: number;

  @IsOptional()
  @Type(() => Number)
  skip: number;

  @IsOptional()
  @Type(() => Number)
  category: number;

  @IsOptional()
  @IsString()
  skills: string;

  @IsOptional()
  @Type(() => Number)
  rate: number;

  @IsOptional()
  @Type(() => Number)
  duration: number;

  @IsOptional()
  @IsEnum(DurationType)
  durationType: DurationType;

  @IsOptional()
  @IsEnum(EnglishLevel)
  englishLevel: EnglishLevel;

  @IsOptional()
  @IsString()
  keyWord: string;
}
