import {
  DurationType,
  EnglishLevel,
} from 'src/modules/job-post/entities/job-post.entity';
import {
  ArrayMinSize,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Category } from 'src/modules/category/entities/category.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobPostDto {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => String)
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly duration: number;

  @ApiProperty()
  @IsEnum(DurationType)
  readonly durationType: DurationType;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  readonly categoryId: Category;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly rate: number;

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
  @IsNotEmpty()
  @IsString()
  readonly jobDescription: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly userId: number;

  @ApiProperty()
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  readonly id?: number;

  @ApiProperty()
  @Transform(({ value }) => {
    return [true, 'enabled', 'true'].indexOf(value) > -1;
  })
  @IsNotEmpty()
  @IsBoolean()
  readonly isDraft: boolean;
}
