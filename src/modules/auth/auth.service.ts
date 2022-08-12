import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthDto } from './dto/auth.dto';
import { Users } from './entities/users.entity';
import { genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly AuthRepo: Repository<Users>,
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
      if (createdUser) return true;
      return false;
    }
  }
}
