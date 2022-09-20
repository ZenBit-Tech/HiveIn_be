import { IsString } from 'class-validator';

export class createOfferDto {
  @IsString()
  jobPostId: number;

  @IsString()
  freelancerId: number;
}
