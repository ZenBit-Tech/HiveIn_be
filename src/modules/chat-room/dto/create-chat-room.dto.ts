import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { chatRoomStatus } from 'src/modules/chat-room/typesDef';

export class createChatRoomDto {
  @ApiProperty({
    description: 'Id of job post that will be discussed in the chat room',
    example: 1,
  })
  @IsNumber()
  jobPostId: number;

  @ApiProperty({
    description: 'Id of freelancer participating in the chat room',
    example: 1,
  })
  @IsNumber()
  freelancerId: number;

  @ApiProperty({
    description: 'Status of chat room',
    enum: chatRoomStatus,
    example: chatRoomStatus.FOR_ALL,
  })
  @IsEnum({ enum: chatRoomStatus })
  status: chatRoomStatus;
}
