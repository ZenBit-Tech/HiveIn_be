import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({
    description: 'Name of skill',
    example: 'smm',
  })
  @IsString()
  name: string;
}
