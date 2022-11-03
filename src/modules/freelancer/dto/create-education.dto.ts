import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export class CreateEducationDto {
  @ApiProperty({
    description: 'City in which the education was received',
    example: 'London',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Description of education',
    example:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Degree of education',
    example: 'bachelor',
  })
  @IsString()
  degree: string;

  @ApiProperty({
    description:
      'Name of the educational institution where the education was received',
    example: 'Harvard University',
  })
  @IsString()
  school: string;

  @ApiProperty({
    description: 'Date when you start education',
    type: Date,
  })
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: 'Date when you end education',
    type: Date,
  })
  @IsDate()
  endDate: Date;

  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'Id of freelancer, who has received education',
    example: 1,
  })
  @IsNumber()
  freelancerId: number;
}
