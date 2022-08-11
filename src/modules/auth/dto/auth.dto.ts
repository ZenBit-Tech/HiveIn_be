import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  // Contains,
} from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsString()
  readonly email: string;

  @MinLength(8, {
    message: 'Password can`t be less than 8',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  // DONT WORKS
  // --
  // @Contains('freelancer' || 'job owner', {
  //   message: 'User can be only as a freelancer or job owner',
  // })
  @IsString()
  @IsNotEmpty()
  readonly role: string;
}
