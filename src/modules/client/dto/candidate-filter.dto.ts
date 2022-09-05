import { IsArray, IsString } from 'class-validator';

export class CandidateFilterDto {
  @IsString()
  keyWords: string;

  @IsString()
  category: string;

  @IsString()
  skills: string;
}
