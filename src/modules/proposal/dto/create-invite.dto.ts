import { IsNumber, IsString } from 'class-validator';

export class CreateInviteDto {
  @IsNumber()
  readonly bid: number;

  @IsString()
  readonly inviteMessage: string;

  @IsNumber()
  readonly idFreelancer: number;

  @IsNumber()
  readonly idJobPost: number;
}
