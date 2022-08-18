import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateFreelancerDto {
  @IsString()
  englishLevel: string;

  @IsString()
  position: string;

  @IsString()
  rate: string;

  @IsNumber()
  userId: number;

  @IsNumber()
  categoryId: number;

  @IsArray()
  skillsIds: number[];
}
