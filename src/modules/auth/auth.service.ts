import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthDto } from './dto/auth.dto';
import { Users } from './entities/users.entity';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly AuthRepo: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: AuthDto) {
    const { password, email } = dto;
    const user = await this.AuthRepo.findOneBy({ email });

    if (user) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'This email already exist',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const newUser = {
        email: email,
        password: password,
      };

      const salt = genSaltSync(10);
      newUser.password = hashSync(newUser.password, salt);
      const createdUser = await this.AuthRepo.save(newUser);

      return createdUser ? true : false;
    }
  }

  async signIn(dto: AuthDto) {
    const { password, email } = dto;
    const user = await this.AuthRepo.findOneBy({ email });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User does not exist',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const isMatch = await compareSync(password, user.password);

      if (!isMatch) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Password is incorrect',
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        return { accessToken: this.signUser(user.id, user.email) };
      }
    }
  }
  signUser(userId: number, email: string) {
    return this.jwtService.sign({
      sub: userId,
      email,
    });
  }
}
