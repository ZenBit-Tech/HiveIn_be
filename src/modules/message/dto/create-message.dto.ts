import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class createMessageDto {
  @ApiProperty({
    description: 'Id of chat room',
    example: 1,
  })
  @IsNumber()
  chatRoomId: number;

  @ApiProperty({
    description: 'Id of user that send message',
    example: 1,
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'Text of message',
    example: 'Lorem Ipsum',
  })
  @IsString()
  text: string;
}
