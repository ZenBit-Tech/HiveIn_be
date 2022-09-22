import { IsEnum, IsNumber } from 'class-validator';
import { Status } from 'src/modules/offer/typesDef';

export class updateOfferDto {
  @IsNumber()
  id: number;

  @IsEnum(Status)
  status: Status;
}
