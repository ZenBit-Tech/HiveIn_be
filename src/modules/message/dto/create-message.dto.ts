import { IsNumber, IsString } from 'class-validator';

export class createMessageDto {
  @IsNumber()
  chatRoomId: number;

  @IsNumber()
  userId: number;

  @IsString()
  text: string;
}
