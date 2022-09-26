import { IsNumber, IsString } from 'class-validator';

export class CreateInviteDto {
  @IsString()
  readonly inviteMessage: string;

  @IsNumber()
  readonly idFreelancer: number;

  @IsNumber()
  readonly idJobPost: number;
}
