import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export class CreateExperienceDto {
  @ApiProperty({
    description: 'City where you got experience',
    example: 'London',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Description of experience',
    example:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Name of post that you has on your job',
    example: 'Junior developer',
  })
  @IsString()
  employer: string;

  @ApiProperty({
    description: 'Job title',
    example: 'Frontend developer',
  })
  @IsString()
  jobTitle: string;

  @ApiProperty({
    description: 'Date when you start work',
    type: Date,
  })
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: 'Date when you end work',
    type: Date,
  })
  @IsDate()
  endDate: Date;

  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'Id of freelancer, who had experience of work',
    example: 1,
  })
  @IsNumber()
  freelancerId: number;
}
