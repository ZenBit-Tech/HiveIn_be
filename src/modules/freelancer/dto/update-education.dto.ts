import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateEducationDto } from './create-education.dto';

export class UpdateEducationDto extends PartialType(CreateEducationDto) {
  @ApiProperty({
    description: 'Id of education',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  id?: number;
}
