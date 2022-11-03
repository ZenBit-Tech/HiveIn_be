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
  @ApiProperty({
    description: 'Title of job post',
    example: 'Lorem Ipsum',
  })
  @IsNotEmpty()
  @Type(() => String)
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: 'Duration of job post',
    example: 10,
    default: 0,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly duration: number;

  @ApiProperty({
    description: 'Duration type of job post',
    enum: DurationType,
    default: DurationType.WEEK,
  })
  @IsEnum(DurationType)
  readonly durationType: DurationType;

  @ApiProperty({
    description: 'Id of category of job post',
    example: 1,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  readonly categoryId: Category;

  @ApiProperty({
    description: 'Rate of job post',
    example: 30,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly rate: number;

  @ApiProperty({
    description: 'Ids of skills that are necessary for job post',
    example: [1, 2, 3],
  })
  @Type(() => Number)
  @IsNumber({}, { each: true })
  @ArrayMinSize(3)
  readonly skillsId: number[];

  @ApiProperty({
    description: 'English level of job post',
    example: EnglishLevel.INTERMEDIATE,
    enum: EnglishLevel,
    default: EnglishLevel.PRE_INTERMEDIATE,
  })
  @ApiProperty()
  @IsEnum(EnglishLevel)
  readonly englishLevel: EnglishLevel;

  @ApiProperty({
    description: 'Description of job post',
    example:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  })
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  readonly jobDescription: string;

  @ApiProperty({
    description: 'Id of user that posted this job post',
    example: 1,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly userId: number;

  @ApiProperty({
    description: 'Id job post',
    example: 1,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  readonly id?: number;

  @ApiProperty({
    description: 'Is this job post are draft',
    example: true,
  })
  @Transform(({ value }) => {
    return [true, 'enabled', 'true'].indexOf(value) > -1;
  })
  @IsNotEmpty()
  @IsBoolean()
  readonly isDraft: boolean;
}
