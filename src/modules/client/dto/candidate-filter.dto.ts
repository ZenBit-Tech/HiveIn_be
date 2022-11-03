import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CandidateFilterDto {
  @ApiProperty({
    description:
      'Key words that will ber searched for in the title and description',
    example: 'dev',
  })
  @IsString()
  keyWords: string;

  @ApiProperty({
    description: 'Id of category of freelancer',
    example: '1',
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Id of skills which the freelancer has',
    example: '1,5,8,3',
  })
  @IsString()
  skills: string;
}
