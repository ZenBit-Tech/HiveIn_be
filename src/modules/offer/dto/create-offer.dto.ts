import { IsEnum, IsString } from 'class-validator';
import { Initiator } from 'src/modules/offer/typesDef';

export class createOfferDto {
  @IsString()
  jobPostId: number;

  @IsString()
  freelancerId: number;

  @IsEnum(Initiator)
  initiator: Initiator;
}
