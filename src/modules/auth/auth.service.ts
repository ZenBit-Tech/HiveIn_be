import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthDto } from './dto/auth.dto';
import { Users } from '../entities/users.entity';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly authRepo: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  /* 
    When you are hashing your data the module will go through a series of rounds to give you a secure hash. 
    The value you submit here will be used to go through 2^rounds iterations of processing.
  */
  private saltRounds = 10;

  async signUp(dto: AuthDto) {
    const { password, email } = dto;
    const user = await this.authRepo.findOneBy({ email });

    if (user) {
      throw new ConflictException('User already exists');
    }

    const salt = await genSalt(this.saltRounds);
    const hashPassword = await hash(password, salt);

    const createdUser = await this.authRepo.save({
      email,
      password: hashPassword,
    });

    return this.signUser(createdUser.id, createdUser.email);
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
      role,
    };
  }
}
