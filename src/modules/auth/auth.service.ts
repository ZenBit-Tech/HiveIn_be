import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthDto } from './dto/auth.dto';
import { Users } from '../entities/users.entity';
import { compare, genSaltSync, hashSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly authRepo: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: AuthDto) {
    const { password, email } = dto;
    const user = await this.authRepo.findOneBy({ email });

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
      const createdUser = await this.authRepo.save(newUser);

      return this.signUser(createdUser.id, createdUser.email);
    }
  }

  async signIn(dto: AuthDto) {
    const { password, email } = dto;
    const user = await this.authRepo.findOneBy({ email });

    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }

    if (user.googleId) {
      throw new ConflictException('User should sign in through Google');
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) throw new UnauthorizedException('Password incorrect');

    return this.signUser(user.id, user.email);
  }

  async signUser(id: number, email: string) {
    const { role } = await this.authRepo.findOneBy({ email });

    return {
      token: this.jwtService.sign({
        sub: id,
        email,
      }),
      email,
      id,
      role,
    };
  }
}
