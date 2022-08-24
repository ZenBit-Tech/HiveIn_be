import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
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
import { ForgotPassword } from '../entities/forgot-password.entity';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { AuthRestorePasswordDto } from './dto/restore-password.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly authRepo: Repository<Users>,
    @InjectRepository(ForgotPassword)
    private readonly forgotPasswordRepo: Repository<ForgotPassword>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private mailService: MailerService,
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

  async forgotPassword({ email }: AuthForgotPasswordDto) {
    const user = await this.authRepo.findOneBy({ email });

    if (user) {
      const userAbout = await this.signUser(user.id, user.email);

      await this.forgotPasswordRepo.save({
        user: user,
        link: userAbout.token,
      });

      const url =
        this.configService.get<string>('FRONTEND_RESTORE_PASSWORD_URL') +
        userAbout.token;

      await this.mailService.sendMail({
        to: email,
        subject: 'GetJob Forgot password',
        from: 'milkav06062003@gmail.com',
        html: `<h1>Change password</h1><p>If you want to change password go to:</p><a href="${url}">${url}</a>`,
      });

      return true;
    }
    return false;
  }

  async restorePassword({ password, token }: AuthRestorePasswordDto) {
    const forgotPassword = await this.forgotPasswordRepo.findOne({
      where: {
        link: token,
      },
      relations: {
        user: true,
      },
    });
    const salt = await genSalt(this.saltRounds);
    const updateUser = forgotPassword.user;
    updateUser.password = await hash(password, salt);
    const createdUser = await this.authRepo.save(updateUser);
    if (createdUser) {
      await this.forgotPasswordRepo.delete({
        link: token,
      });
    }
    return createdUser;
  }
}
