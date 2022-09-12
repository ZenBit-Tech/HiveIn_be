import { IsNumber, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsNumber()
  fromUserId: number;

  @IsNumber()
  toUserId: number;

  @IsString()
  type: string;
}
