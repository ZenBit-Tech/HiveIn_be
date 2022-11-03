import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class searchParamDto {
  @ApiProperty({
    description: 'Id of the chat room',
    example: 1,
  })
  @IsString()
  id: string;
}
