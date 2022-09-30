import { IsEnum } from 'class-validator';
import { Status } from 'src/modules/offer/typesDef';

export class UpdateOfferDto {
  @IsEnum(Status)
  status: Status;
}
