import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOfferDto {
  @Type(() => Number)
  @ApiProperty({
    description: 'Id of job post of offer',
    example: 1,
  })
  @IsNumber()
  @IsInt()
  jobPostId: number;

  @Type(() => Number)
  @ApiProperty({
    description: 'Id of freelancer of offer',
    example: 1,
  })
  @IsNumber()
  @IsInt()
  freelancerId: number;
}
