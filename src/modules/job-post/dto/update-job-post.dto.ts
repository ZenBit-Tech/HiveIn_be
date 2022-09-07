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

  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  userId: number;
}
