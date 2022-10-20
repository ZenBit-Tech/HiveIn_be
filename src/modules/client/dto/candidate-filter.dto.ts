import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CandidateFilterDto {
  @ApiProperty()
  @IsString()
  keyWords: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsString()
  skills: string;
}
