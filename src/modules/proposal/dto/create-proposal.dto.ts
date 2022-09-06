import {
  DurationType,
  EnglishLevel,
} from 'src/modules/job-post/entities/job-post.entity';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateProposalDto {
  @IsString()
  readonly coverLetter: string;

  @IsNumber()
  readonly rate: number;

  // add questions and attachments
  @IsNumber()
  readonly idFreelancer: number;

  @IsNumber()
  readonly idClient: number;
}
