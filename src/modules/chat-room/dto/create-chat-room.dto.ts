import { IsEnum, IsNumber } from 'class-validator';
import { chatRoomStatus } from 'src/modules/chat-room/typesDef';

export class createChatRoomDto {
  @IsNumber()
  jobPostId: number;

  @IsNumber()
  freelancerId: number;

  @IsEnum({ enum: chatRoomStatus })
  status: chatRoomStatus;
}
