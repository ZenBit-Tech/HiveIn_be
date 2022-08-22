import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { UpdateEducationDto } from 'src/modules/education/dto/update-education.dto';
import { UpdateExperienceDto } from 'src/modules/experience/dto/update-experience.dto';

export class CreateFreelancerDto {
  @IsNumber()
  @IsOptional()
  id: number;

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

  @IsOptional()
  @IsArray()
  educations?: UpdateEducationDto[];

  @IsOptional()
  @IsArray()
  experiences?: UpdateExperienceDto[];
}
