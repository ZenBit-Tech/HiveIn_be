import { IsNumber, IsString } from 'class-validator';

export class prolongDto {
  @IsString()
  token: string;

  @IsNumber()
  chatId: number;
}
