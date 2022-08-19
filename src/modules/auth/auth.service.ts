import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthDto } from './dto/auth.dto';
import { Users } from '../entities/users.entity';
import { ForgotPassword } from '../entities/forgot-password.entity';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { AuthRestorePasswordDto } from './dto/restore-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly authRepo: Repository<Users>,
    @InjectRepository(ForgotPassword)
    private readonly forgotPasswordRepo: Repository<ForgotPassword>,
    private readonly jwtService: JwtService,
    private mailService: MailerService,
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
        return this.signUser(user.id, user.email);
      }
    }
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

  async forgotPassword({ email }: AuthForgotPasswordDto) {
    const user = await this.authRepo.findOneBy({ email });
    console.log(user);

    if (user) {
      const userAbout = await this.signUser(user.id, user.email);

      const result = await this.forgotPasswordRepo.save({
        user: user,
        link: userAbout.token,
      });

      console.log(result);

      const url = `http://localhost:3000/restore-password?token=${userAbout.token}`;

      const transport = await this.mailService.sendMail({
        to: email,
        subject: 'GetJob Forgot password',
        from: 'milkav06062003@gmail.com',
        html: `<h1>Change password</h1><p>If you want to change password go to:</p><a href="${url}">${url}</a>`,
      });

      console.log(`Email successfully dispatched to ${email}`);
      return transport;
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
    const salt = genSaltSync(10);
    const updateUser = forgotPassword.user;
    updateUser.password = hashSync(password, salt);
    const createdUser = await this.authRepo.save(updateUser);
    if (createdUser) {
      await this.forgotPasswordRepo.delete({
        link: token,
      });
    }
    return createdUser;
  }
}
