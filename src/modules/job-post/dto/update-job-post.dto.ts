import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateJobPostDto {
  @IsString()
  @ApiProperty()
  readonly jobDescription: string;

  @IsNumber()
  @ApiProperty()
  readonly rate: number;

  @IsNumber()
  @ApiProperty()
  userId: number;
}
