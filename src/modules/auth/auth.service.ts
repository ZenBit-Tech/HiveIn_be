import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthDto } from './dto/auth.dto';
import { Users } from './entities/users.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly AuthRepo: Repository<Users>,
  ) {}

  async signUp(dto: AuthDto) {
    const { password, email, role } = dto;
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
        role: role,
      };

      bcrypt.genSalt((err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) console.error(err);
          else {
            newUser.password = hash;
            this.AuthRepo.save(newUser);
          }
        });
      });
    }
  }
}
