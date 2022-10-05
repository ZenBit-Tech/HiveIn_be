import { IsInt, IsNumber } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @IsInt()
  jobPostId: number;

  @IsNumber()
  @IsInt()
  freelancerId: number;
}
