import { CreateProfileDto } from './create-profile.dto';

export class ReplaceProfileDto extends CreateProfileDto {
  id: number;
  createAt: string;
  updateAt: string;
}
