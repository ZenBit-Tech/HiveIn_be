import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Status } from 'src/modules/offer/typesDef';

export class UpdateOfferDto {
  @ApiProperty({
    description: 'Status of offer',
    example: Status.ACCEPTED,
    enum: Status,
  })
  @IsEnum(Status)
  status: Status;
}
