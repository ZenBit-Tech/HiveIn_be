import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateJobPostDto } from './create-job-post.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class SaveJobDraftDto extends PartialType(
  OmitType(CreateJobPostDto, ['userId', 'title']),
) {
  @ApiProperty({
    description: 'Id of user of this job post',
    example: 1,
  })
  @IsNumber()
  readonly userId: number;

  @ApiProperty({
    description: 'Title of job post',
    example: 'Lorem Ipsum',
  })
  @Type(() => String)
  @IsString()
  readonly title: string;
}
