import { IsInt, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOfferDto {
  @Type(() => Number)
  @IsNumber()
  @IsInt()
  jobPostId: number;

  @Type(() => Number)
  @IsNumber()
  @IsInt()
  freelancerId: number;
}
