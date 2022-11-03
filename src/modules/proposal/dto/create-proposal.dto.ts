import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProposalDto {
  @ApiProperty({
    description: 'Text message of proposal',
    example:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  })
  @IsNotEmpty()
  @IsString()
  readonly message: string;

  @ApiProperty({
    description: 'Bid of job',
    example: 30,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly bid: number;

  @ApiProperty({
    description: 'Id of job post of proposal',
    example: 1,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  readonly idJobPost: number;

  @ApiProperty({
    description: 'Id of freelancer who sent proposal',
    example: 1,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  readonly idFreelancer: number;
}
