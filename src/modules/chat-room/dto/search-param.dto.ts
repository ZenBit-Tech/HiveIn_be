import { IsString } from 'class-validator';

export class searchParamDto {
  @IsString()
  id: string;
}
