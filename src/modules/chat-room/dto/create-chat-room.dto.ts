import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { chatRoomStatus } from 'src/modules/chat-room/typesDef';

export class createChatRoomDto {
  @ApiProperty()
  @IsNumber()
  jobPostId: number;

  @ApiProperty()
  @IsNumber()
  freelancerId: number;

  @ApiProperty()
  @IsEnum({ enum: chatRoomStatus })
  status: chatRoomStatus;
}
