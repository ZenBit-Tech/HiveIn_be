import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  DurationType,
  EnglishLevel,
} from 'src/modules/job-post/entities/job-post.entity';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class searchJobFiltersDto {
  @ApiProperty({
    description: 'Number of job post that will be take',
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  take: number;

  @ApiProperty({
    description: 'Number of job post that will be skip',
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  skip: number;

  @ApiProperty({
    description: 'Id of category of job post',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  category: number;

  @ApiProperty({
    description: 'Id of skills of job post',
    example: '1_3_10_4',
    required: false,
  })
  @IsOptional()
  @IsString()
  skills: string;

  @ApiProperty({
    description: 'Rate of job post',
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  rate: number;

  @ApiProperty({
    description: 'Duration of job post',
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  duration: number;

  @ApiProperty({
    description: 'Duration of job post',
    enum: DurationType,
    required: false,
  })
  @IsOptional()
  @IsEnum(DurationType)
  durationType: DurationType;

  @ApiProperty({
    description: 'Level of english is not necessary for work',
    enum: EnglishLevel,
    required: false,
  })
  @IsOptional()
  @IsEnum(EnglishLevel)
  englishLevel: EnglishLevel;

  @ApiProperty({
    description: 'Key word of job post',
    example: 'dev',
    required: false,
  })
  @IsOptional()
  @IsString()
  keyWord: string;
}
