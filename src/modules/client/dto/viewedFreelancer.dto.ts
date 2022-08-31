import { IsNumber } from 'class-validator';

export class ViewedFreelancerDto {
  @IsNumber()
  freelancerId: number;
}
