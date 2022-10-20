import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class AuthRestorePasswordDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @IsString()
  readonly token: string;

  @ApiProperty({
    example: '98284EWw%',
  })
  @MinLength(8, {
    message: 'Password can`t be less than 8',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
