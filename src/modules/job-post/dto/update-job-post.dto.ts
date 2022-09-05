import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateJobPostDto {
  @Type(() => String)
  @IsString()
  @ApiProperty()
  readonly jobDescription: string;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  readonly rate: number;

  @Type(() => Boolean)
  @IsBoolean()
  @ApiProperty()
  isDraft: boolean;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  userId: number;

  @ApiProperty()
  @Type(() => QuestionDto)
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(3)
  questions?: QuestionDto[];
}

export class QuestionDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  question: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  id: number;
}
