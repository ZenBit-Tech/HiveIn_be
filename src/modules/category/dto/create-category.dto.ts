import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Name of new category',
    example: 'IT',
  })
  @IsString()
  name: string;
}
