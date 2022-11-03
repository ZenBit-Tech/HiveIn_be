import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateExperienceDto } from './create-experience.dto';

export class UpdateExperienceDto extends PartialType(CreateExperienceDto) {
  @ApiProperty({
    description: 'Id of experience of freelancer',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  id?: number;
}
