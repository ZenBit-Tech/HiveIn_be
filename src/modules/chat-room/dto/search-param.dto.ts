import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class searchParamDto {
  @ApiProperty()
  @IsString()
  id: string;
}
