import { IsEnum, IsNumber } from 'class-validator';
import { chatRoomStatus } from '../entities/chat-room.entity';

export class createChatRoomDto {
  @IsNumber()
  jobPostId: number;

  @IsNumber()
  freelancerId: number;

  @IsEnum({ enum: chatRoomStatus })
  status: chatRoomStatus;
}
