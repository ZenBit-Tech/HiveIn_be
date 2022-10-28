import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber } from 'class-validator';
import { Offer } from 'src/modules/offer/entities/offer.entity';

export class CreateContractDto {
  @ApiProperty()
  @IsNumber()
  readonly offer: Offer;

  @ApiProperty()
  @IsDateString()
  readonly startDate: Date;

  @ApiProperty()
  @IsDateString()
  readonly endDate: Date;
}
