import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateJobPostDto } from './create-job-post.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class SaveJobDraftDto extends PartialType(
  OmitType(CreateJobPostDto, ['userId', 'title']),
) {
  @ApiProperty()
  @IsNumber()
  readonly userId: number;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  readonly title: string;
}
