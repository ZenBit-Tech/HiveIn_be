import { IsDateString, IsNumber } from 'class-validator';
import { Offer } from 'src/modules/offer/entities/offer.entity';

export class CreateContractDto {
  @IsNumber()
  readonly offer: Offer;

  @IsDateString()
  readonly startDate: Date;

  @IsDateString()
  readonly endDate: Date;
}
