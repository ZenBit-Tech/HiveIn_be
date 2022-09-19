import { IsNumber } from 'class-validator';

export class createChatRoomDto {
  @IsNumber()
  offerId: number;
}
