import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber } from 'class-validator';

export class CreateOfferDto {
  @ApiProperty({
    description: 'Id of job post of offer',
    example: 1,
  })
  @IsNumber()
  @IsInt()
  jobPostId: number;

  @ApiProperty({
    description: 'Id of freelancer of offer',
    example: 1,
  })
  @IsNumber()
  @IsInt()
  freelancerId: number;
}
