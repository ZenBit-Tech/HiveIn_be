import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  DurationType,
  EnglishLevel,
} from 'src/modules/job-post/entities/job-post.entity';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class searchJobFiltersDto {
  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  take: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  skip: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  category: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  skills: string;

  @IsOptional()
  @Type(() => Number)
  rate: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  duration: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(DurationType)
  durationType: DurationType;

  @ApiProperty()
  @IsOptional()
  @IsEnum(EnglishLevel)
  englishLevel: EnglishLevel;

  @ApiProperty()
  @IsOptional()
  @IsString()
  keyWord: string;
}
