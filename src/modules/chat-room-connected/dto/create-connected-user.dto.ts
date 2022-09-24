import { IsNumber, IsString } from 'class-validator';

export class createConnectedUserDto {
  @IsString()
  socketId: string;

  @IsNumber()
  userId: number;
}
