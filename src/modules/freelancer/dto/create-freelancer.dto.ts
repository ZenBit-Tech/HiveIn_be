import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { UpdateEducationDto } from './update-education.dto';
import { UpdateExperienceDto } from './update-experience.dto';
import { Users } from 'src/modules/entities/users.entity';
import { ApiProperty } from '@nestjs/swagger';
import { EnglishLevel } from 'src/modules/job-post/entities/job-post.entity';

export class CreateFreelancerDto {
  @ApiProperty({
    description: 'Id of freelancer',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiProperty({
    description: 'English level of freelancer',
    type: EnglishLevel,
  })
  @IsString()
  englishLevel: string;

  @ApiProperty({
    description: 'Position of freelancer',
    example: 'Frontend developer',
  })
  @IsString()
  position: string;

  @ApiProperty({
    description: 'Description of freelancer',
    example:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Rate of freelancer',
    example: '30',
  })
  @IsString()
  rate: string;

  @ApiProperty({
    description: 'Id of user of freelancer',
    example: 1,
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'Id of category of freelancer',
    example: 1,
  })
  @IsNumber()
  categoryId: number;

  @ApiProperty({
    description: 'Ids of skills of freelancer',
    type: [Number],
  })
  @IsArray()
  skillsIds: number[];

  @ApiProperty({
    description: 'User of freelancer',
    type: Users,
  })
  @IsObject()
  user: Users;

  @ApiProperty({
    description: 'Educations was received by the freelancer',
    type: [UpdateEducationDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  educations?: UpdateEducationDto[];

  @ApiProperty({
    description: 'Experiences of freelancer',
    type: [UpdateExperienceDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  experiences?: UpdateExperienceDto[];
}
