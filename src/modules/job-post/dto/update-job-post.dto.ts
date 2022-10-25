import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateJobPostDto {
  @ApiProperty({
    description: 'Description of job post',
    example:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  })
  @Type(() => String)
  @IsString()
  readonly jobDescription: string;

  @ApiProperty({
    description: 'Rate of job post',
    example: 30,
  })
  @Type(() => Number)
  @IsNumber()
  readonly rate: number;

  @ApiProperty({
    description: 'Id of user of this job post',
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  userId: number;
}
